import { LiveFeedClient } from "@/components/live/LiveFeedClient";
import { Container } from "@/components/ui/Container";

export const metadata = {
  title: "Live board",
  description:
    "IPA daily vessels at berth/anchorage plus 2023 JNPA yard replay. Not live AIS.",
};

export default function LivePage() {
  return (
    <div className="relative isolate overflow-hidden bg-surface-1 pt-20 pb-24 sm:pt-28 sm:pb-20">
      <div className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(60%_80%_at_20%_0%,rgba(228,77,14,0.14),transparent_70%)]" />
      <Container width="wide" className="relative px-4 sm:px-6">
        <LiveFeedClient />
      </Container>
    </div>
  );
}
