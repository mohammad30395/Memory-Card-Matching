import PageFrame from "@/components/PageFrame";
import PlayerForm from "@/components/PlayerForm";
import { ROUTES } from "@/lib/constants";

export default function PlayPage() {
  return (
    <PageFrame>
      <PlayerForm
        title="Ready to play?"
        description="Enter the local profile used for this match. Saved values are auto-filled next time."
        submitLabel="Continue to mode"
        nextPath={ROUTES.mode}
      />
    </PageFrame>
  );
}
