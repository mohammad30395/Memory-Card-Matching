import PageFrame from "@/components/PageFrame";
import PlayerForm from "@/components/PlayerForm";

export default function SettingsPage() {
  return (
    <PageFrame>
      <PlayerForm
        title="Settings"
        description="Update the name and username stored locally on this browser."
        submitLabel="Save settings"
        nextPath=""
      />
    </PageFrame>
  );
}
