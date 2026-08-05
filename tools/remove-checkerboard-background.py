"""Remove a baked light checkerboard from an isolated pictogram.

Only near-neutral, bright pixels connected to the canvas edge become transparent.
Enclosed light regions (for example a clock face) remain intact.
"""

from __future__ import annotations

import argparse
from collections import deque
from pathlib import Path

from PIL import Image


def is_light_checker(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, _alpha = pixel
    spread = max(red, green, blue) - min(red, green, blue)
    return min(red, green, blue) >= 218 and spread <= 14


def is_magenta_chroma(pixel: tuple[int, int, int, int]) -> bool:
    red, green, blue, _alpha = pixel
    return red >= 205 and blue >= 180 and green <= 90


def remove_checkerboard(source: Path, destination: Path) -> None:
    image = Image.open(source).convert("RGBA")
    width, height = image.size
    pixels = image.load()
    corner = pixels[0, 0]
    if is_magenta_chroma(corner):
        for y in range(height):
            for x in range(width):
                if is_magenta_chroma(pixels[x, y]):
                    pixels[x, y] = (*pixels[x, y][:3], 0)
        destination.parent.mkdir(parents=True, exist_ok=True)
        image.save(destination)
        return

    is_background = is_light_checker
    visited = bytearray(width * height)
    queue: deque[tuple[int, int]] = deque()

    def enqueue(x: int, y: int) -> None:
        index = y * width + x
        if not visited[index] and is_background(pixels[x, y]):
            visited[index] = 1
            queue.append((x, y))

    for x in range(width):
        enqueue(x, 0)
        enqueue(x, height - 1)
    for y in range(height):
        enqueue(0, y)
        enqueue(width - 1, y)

    while queue:
        x, y = queue.popleft()
        pixels[x, y] = (*pixels[x, y][:3], 0)
        if x:
            enqueue(x - 1, y)
        if x + 1 < width:
            enqueue(x + 1, y)
        if y:
            enqueue(x, y - 1)
        if y + 1 < height:
            enqueue(x, y + 1)

    destination.parent.mkdir(parents=True, exist_ok=True)
    image.save(destination)


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("source", type=Path)
    parser.add_argument("destination", type=Path)
    args = parser.parse_args()
    remove_checkerboard(args.source, args.destination)


if __name__ == "__main__":
    main()
