alter table ctf rename to ctf_series;
alter table event rename to ctf_event;
alter table code_snippet
    add constraint guide_or_writeup check (
            (code_snippet.guide_id is not null and code_snippet.writeup_id is null) or
            (code_snippet.guide_id is null and code_snippet.writeup_id is not null)
        );
