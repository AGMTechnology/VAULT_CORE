function toTrimmedString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function clone(value) {
  return JSON.parse(JSON.stringify(value ?? {}));
}

function parseSemver(version) {
  const normalized = toTrimmedString(version);
  const match = normalized.match(/^(\d+)\.(\d+)\.(\d+)$/);
  if (!match) {
    return null;
  }
  return match.slice(1).map((segment) => Number.parseInt(segment, 10));
}

function compareSemver(a, b) {
  const left = parseSemver(a);
  const right = parseSemver(b);
  if (!left || !right) {
    return toTrimmedString(a).localeCompare(toTrimmedString(b));
  }
  for (let index = 0; index < 3; index += 1) {
    if (left[index] > right[index]) return 1;
    if (left[index] < right[index]) return -1;
  }
  return 0;
}

function normalizeSkillsBundle(raw) {
  const source = raw && typeof raw === "object" ? clone(raw) : {};
  const skills = Array.isArray(source.skills) ? source.skills : [];
  return {
    skills: skills
      .map((item) => ({
        skillId: toTrimmedString(item?.skillId),
        version: toTrimmedString(item?.version),
      }))
      .filter((item) => item.skillId && item.version),
  };
}

function mergeSkillEntries(existingSkills, matchedSkills) {
  const bySkillId = new Map();

  for (const skill of existingSkills) {
    const current = bySkillId.get(skill.skillId);
    if (!current || compareSemver(skill.version, current.version) > 0) {
      bySkillId.set(skill.skillId, skill);
    }
  }

  for (const match of matchedSkills) {
    const normalized = {
      skillId: toTrimmedString(match?.skillId),
      version: toTrimmedString(match?.version),
    };
    if (!normalized.skillId || !normalized.version) {
      continue;
    }
    const current = bySkillId.get(normalized.skillId);
    if (!current || compareSemver(normalized.version, current.version) > 0) {
      bySkillId.set(normalized.skillId, normalized);
    }
  }

  return Array.from(bySkillId.values()).sort((left, right) => left.skillId.localeCompare(right.skillId));
}

export async function enrichContractWithSkillsBundle(contract, skillsHub) {
  const enriched = clone(contract);
  const currentBundle = normalizeSkillsBundle(enriched.skillsBundle);
  enriched.skillsBundle = currentBundle;

  let matchResponse;
  try {
    matchResponse = await Promise.resolve(skillsHub.matchSkills({ contract: enriched, limit: 8 }));
  } catch {
    matchResponse = {
      ok: false,
      matches: [],
    };
  }

  if (!matchResponse.ok) {
    return enriched;
  }

  currentBundle.skills = mergeSkillEntries(currentBundle.skills, matchResponse.matches ?? []);
  return enriched;
}
