import { createFileRoute } from "@tanstack/react-router";
import OverviewPage from "@/pages/Overview";

export const Route = createFileRoute("/overview")({
  validateSearch: (s: Record<string, unknown>) => ({
    state: s["state"] === "building" ? ("building" as const) : undefined,
  }),
  head: () => ({
    meta: [
      { title: "Overview · ReferralHero" },
      { name: "description", content: "Your referral program results, top advocates, funnel and activity at a glance." },
      { property: "og:title", content: "Overview · ReferralHero" },
      { property: "og:description", content: "Your referral program results, top advocates, funnel and activity at a glance." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: Overview,
});

function Overview() {
  const navigate = Route.useNavigate();
  const { state } = Route.useSearch();
  const current = state ?? "established";

  return (
    <>
      <OverviewPage programState={current} />
      {/* Designer-only ROI view switch — not part of the page design */}
      <button
        type="button"
        onClick={() =>
          navigate({
            to: "/overview",
            search: () =>
              current === "established"
                ? { state: "building" as const }
                : { state: undefined as undefined | "building" },
          })
        }
        style={{
          position: "fixed",
          bottom: "1rem",
          left: "50%",
          transform: "translateX(-50%)",
          zIndex: 9999,
          padding: "0.5rem 0.875rem",
          borderRadius: "9999px",
          border: "1px solid rgba(0,0,0,0.12)",
          background: "rgba(255,255,255,0.9)",
          backdropFilter: "blur(4px)",
          boxShadow: "0 2px 8px rgba(0,0,0,0.15)",
          fontSize: "0.75rem",
          fontWeight: 600,
          cursor: "pointer",
          color: "#111",
        }}
      >
        {current === "established" ? "View: 1.5×+ ROI → under 1.5×" : "View: under 1.5× → 1.5×+ ROI"}
      </button>
    </>
  );
}
