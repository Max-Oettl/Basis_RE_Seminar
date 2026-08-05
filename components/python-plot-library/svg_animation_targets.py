from __future__ import annotations

from pathlib import Path
import xml.etree.ElementTree as ET


SVG_NAMESPACE = "http://www.w3.org/2000/svg"


def _find_by_id(root: ET.Element, target_id: str) -> ET.Element | None:
    return next((element for element in root.iter() if element.get("id") == target_id), None)


def prepare_svg_animation_targets(
    svg_path: str | Path,
    targets: dict[str, str],
    sibling_groups: list[tuple[str, str, list[str]]] | None = None,
    target_attributes: dict[str, dict[str, str]] | None = None,
) -> None:
    """Expose semantic SVG targets without embedding timing or animation code."""

    ET.register_namespace("", SVG_NAMESPACE)
    tree = ET.parse(svg_path)
    root = tree.getroot()

    for group_id, group_label, child_ids in sibling_groups or []:
        if _find_by_id(root, group_id) is not None:
            continue
        parent_map = {child: parent for parent in root.iter() for child in parent}
        children = []
        for child_id in child_ids:
            child = _find_by_id(root, child_id)
            if child is None:
                raise ValueError(f"Cannot find SVG element with id '{child_id}'.")
            children.append(child)
        parents = {parent_map.get(child) for child in children}
        if None in parents or len(parents) != 1:
            raise ValueError(f"SVG elements for '{group_id}' must share one parent.")

        parent = parents.pop()
        ordered = list(parent)
        insert_index = min(ordered.index(child) for child in children)
        group = ET.Element(
            f"{{{SVG_NAMESPACE}}}g",
            {
                "id": group_id,
                "data-anim-target": "true",
                "data-anim-label": group_label,
            },
        )
        for child in sorted(children, key=ordered.index):
            parent.remove(child)
            group.append(child)
        parent.insert(insert_index, group)

    for target_id, label in targets.items():
        element = _find_by_id(root, target_id)
        if element is None:
            raise ValueError(f"Cannot find SVG animation target with id '{target_id}'.")
        element.set("data-anim-target", "true")
        element.set("data-anim-label", label)

    for target_id, attributes in (target_attributes or {}).items():
        element = _find_by_id(root, target_id)
        if element is None:
            raise ValueError(f"Cannot set attributes on missing SVG target '{target_id}'.")
        for name, value in attributes.items():
            element.set(name, value)

    tree.write(svg_path, encoding="utf-8", xml_declaration=True)
