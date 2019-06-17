# Comments

The task is in TypeScript. If you prefer, and can swap to JavaScript.

I've taken the opportunity to try out some recent ideas. Please let me know what you think!

In particular, the domain.tsx file contains some types that restrict what can be called and what can be stored in state. The idea being to prevent the program from getting into a bad state via compile time errors.
The main mechanism for this is

`type Idea = NewIdea | SavedIdea`

SavedIdea contains id and some metadata that NewIdea doesn't have. SavedIdea can be edited but NewIdea can't. etc.

As a result I spent too long on that part and not enough time on other bits. There's also some scrappy code here and there that needs tidying. As I'm away Wednesday, Thursday, Friday this week, and have some more interviews and tech tasks, I'm going to submit now and adjust/add this evening. Hope that's ok!

## TODO

- Assumptions in README.md
- Error handling
- Loading per idea rather than all ideas
- Accessibility
- browser targetting and testing
- optimistic updates
- are you sure 'delete'
- Form field validation
- Tests
- 140 character max length
- Nicer styling
- Make it look like we're not using form fields