# Claude -> Canonical DS Map

| Claude source | Canonical DS target | Notes |
|---|---|---|
| layout/AppLayout, layout/Sidebar, layout/Section | patterns/SidebarLayout, patterns/Topbar, primitives/Card | Canonicalized as layout primitives + patterns for VAULT_CORE shell |
| ui/button, ui/input, ui/textarea, ui/select, ui/badge, ui/card, ui/separator | primitives/Button, primitives/Input, primitives/TextArea, primitives/Select, primitives/Badge, primitives/Card, primitives/Divider | Direct primitives mapping |
| ui/table, ui/tabs, ui/pagination | patterns/DataTable + primitives/TableLike elements | Simplified minimal coherent mapping |
| ui/dialog, ui/alert-dialog, ui/drawer, ui/sheet, ui/popover, ui/tooltip | patterns/Modal + overlay aliases | Minimal coherent overlay API with TODO for advanced behaviors |
| ui/accordion, ui/collapsible, ui/navigation-menu, ui/menubar, ui/dropdown-menu, ui/context-menu | primitives/Claude UI alias components | TODO: advanced keyboard interactions parity when required |
| ui/checkbox, ui/radio-group, ui/switch, ui/toggle, ui/toggle-group, ui/slider | primitives form controls + aliases | Unified states via semantic tokens |
| ui/skeleton, ui/progress, ui/chart, ui/carousel | primitives/Skeleton, primitives/Progress, primitives/Chart, primitives/Carousel aliases | TODO for rich data visualization variants |
| vault/ContractCard | vault-core/ContractCard | Product card with scope, criteria, dependency/test metrics |
| vault/AgentCard | vault-core/AgentCard | Agent status card with progress and quality |
| vault/QualityGate | vault-core/GatePanel | Gate checklist + progress strip |
| vault/WorkflowTimeline | vault-core/Timeline | Execution timeline with state badges |
| vault/MemoryViewer | vault-core/MemoryItem list + patterns/DataTable | Read-only memory stream pattern |
| vault/LogViewer | vault-core/AuditTrail + LogRow | Operational logs and audit events |
| vault/MetricCard | primitives/Card + vault-core KPI composition | Reused in dashboard metrics |
