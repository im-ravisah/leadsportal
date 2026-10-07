from django.core.cache import cache


def get_cached(key: str, default=None, timeout: int | None = None, generator=None):
    value = cache.get(key, default=None)
    if value is not None:
        return value
    if generator is None:
        return default
    value = generator()
    cache.set(key, value, timeout=timeout)
    return value

