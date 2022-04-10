
create trigger rating_points_update
    before update
    on ctftime_event
    for each row
    set new.rating_points = (((new.score / new.winner_score) + (1 / new.ranking)) * new.weight) /
                            (1 / (1 + new.ranking / new.num_teams));
