drop function if exists calculate_score;
create function calculate_score(str0 text, str1 text, str2 text, str3 text, tag text, category text, search text)
    RETURNS int
BEGIN
    DECLARE score int;
    set score = 0;
    # 10 points for matching the category or having a category in the query
    # (user was probably searching for that category only)
    if (search = category || search like concat('%', category, '%')) then
        set score = 10;
    end if;
    # 3 points if query is part of a tag
    # The scenario where a query contains multiple tags will be handled separately
    if (tag like concat('%', search, '%')) then
        set score = score + 3;
    end if;
    # 1 point for everything else
    if (str0 like concat('%', search, '%')) then
        set score = score + 1;
    end if;
    if (str1 like concat('%', search, '%')) then
        set score = score + 1;
    end if;
    if (str2 like concat('%', search, '%')) then
        set score = score + 1;
    end if;
    if (str3 like concat('%', search, '%')) then
        set score = score + 1;
    end if;
    return score;
end;
