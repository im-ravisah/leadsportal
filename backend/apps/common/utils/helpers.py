def to_snake_case(value: str) -> str:
    return "".join(["_" + c.lower() if c.isupper() else c for c in value]).lstrip("_")


def empty_dict_if_none(value):
    return value or {}

