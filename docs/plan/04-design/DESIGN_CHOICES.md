wireframe_selections:
  navigation:
    variant: "C"
    description: "Collapsible Sidebar (Icons only by default, expands on hover)"
    components: ["Logo", "NavLinks", "Search", "Notifications", "Avatar"]
  floor_plan:
    variant: "B"
    description: "Full Screen Canvas with Floating Toolbar (Maximizes space for drag & drop)"
    components: ["Canvas", "FloatingToolbar", "TableObject", "PropertyPanel"]
  sales_app:
    variant: "A"
    description: "Dashboard First (Focuses on stats, leaderboard, and quick actions)"
    components: ["StatsCard", "LeaderboardBanner", "QuickActions", "RecentReservations"]
  security_app:
    variant: "B"
    description: "Split Screen (Camera on top half, recent scans on bottom half)"
    components: ["CameraView", "ScanTarget", "CapacityCounter", "RecentScansList"]
