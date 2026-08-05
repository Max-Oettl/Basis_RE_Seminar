from __future__ import annotations

import json
import sys
from pathlib import Path


REPO_ROOT = Path(__file__).resolve().parents[4]
PLOT_LIBRARY = REPO_ROOT / "components" / "python-plot-library"
sys.path.insert(0, str(PLOT_LIBRARY))

from advanced_distribution_plots import build_weibull_bathtub_network  # noqa: E402
from reltest_plot_style import apply_reltest_style  # noqa: E402


def main() -> None:
    slide_root = Path(__file__).resolve().parents[1]
    config_path = slide_root / "data" / "weibull_bathtub_network.json"
    output_path = Path(__file__).with_name("weibull_bathtub_network.svg")
    config = json.loads(config_path.read_text(encoding="utf-8"))
    apply_reltest_style()
    build_weibull_bathtub_network(config, output_path)


if __name__ == "__main__":
    main()
