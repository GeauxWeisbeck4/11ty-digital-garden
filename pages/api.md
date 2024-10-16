---
title: API
description: API for notes site
layout: layouts/base.njk
---
# API

The notes are exposed as a static JSON file under `/api/notes.json`.

```
interface Note {
    name: string;
    url: string;
    description?: string;
}
```
