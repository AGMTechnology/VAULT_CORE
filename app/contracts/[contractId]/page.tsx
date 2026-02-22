import { ContractDetailScreen } from "../../components/contract-detail-screen";

type ContractDetailPageProps = {
  readonly params: {
    readonly contractId: string;
  };
};

export default function ContractDetailPage({ params }: ContractDetailPageProps) {
  const contractId = decodeURIComponent(params.contractId);

  return <ContractDetailScreen contractId={contractId} embeddedInLayout />;
}
