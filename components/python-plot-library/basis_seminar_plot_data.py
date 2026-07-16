from __future__ import annotations

from collections.abc import Iterable


# Canonical data for the RE3_TEST_1 Weibull build-up sequence.
# All related plot stages must use these values unless a scene brief explicitly
# documents a different data source.
DEFAULT_FAILURE_TIMES = [12.0, 18.0, 27.0, 44.0, 68.0, 105.0, 160.0]
DEFAULT_FAILURE_TIMES_CSV = ",".join(f"{value:g}" for value in DEFAULT_FAILURE_TIMES)

# Shared log-x limits for the Weibull probability sequence. Keeping these fixed
# prevents visual jumps between points, fit, parameter readout and confidence
# bounds.
DEFAULT_WEIBULL_X_LIMITS = (8.0, 220.0)


def default_failure_times() -> list[float]:
    return list(DEFAULT_FAILURE_TIMES)


def weibull_x_limits(times: Iterable[float] | None = None) -> tuple[float, float]:
    if times is None:
        return DEFAULT_WEIBULL_X_LIMITS

    values = [float(value) for value in times]
    if values == DEFAULT_FAILURE_TIMES:
        return DEFAULT_WEIBULL_X_LIMITS
    if not values:
        return DEFAULT_WEIBULL_X_LIMITS
    return min(values) * 0.65, max(values) * 1.35
