+++
title = "Postgresql Insert Loop"
description = "Commands"
author = "van den Boom"
date = 2020-12-16T19:21:18+01:00
tags = ["markdown", "css", "html", "themes"]
categories = ["themes", "syntax"]
+++

```

do $$
declare 
   counter integer := 0;
begin
   while counter < 100000 loop
      insert into public.person (first_name, last_name) values ('Jack', 'Twin');
	  counter := counter + 1;
   end loop;
end$$; ...

```
