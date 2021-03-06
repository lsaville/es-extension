# EventStore Highlighter

This extension is meant to be used with the stream viewing interface of [Event
Store](https://eventstore.org/)

![gif of eventstore highlighter in action](https://raw.githubusercontent.com/lsaville/readme-screenshots/master/es-extension/peek0QM73Z.gif)

### Whatzit?

The EventStore Highlighter provides two bits of functionality:

1. A small bit of after-the-fact data highlighting to help a person visually parse
a busy event stream by coloring the row of the data a user is most interested
in.
2. The user can provide a comma separated string of keys to "dig" in to the json
data associated with an event to bring a value of interest to the surface.

### Wish list

#### Done
- [x] Data digging -> a bit of data shown from the json block at top level
- [x] Dynamic color option list -> Prevent user from picking a color already used
- [x] Data digging -> Persist digs
- [x] Figure out how to detect page navigation and refresh colors/digs
- [x] Fix event dig duplication since the thing gets called by the observer so much
- [x] Handle accessing data in arrays
- [x] Have a list of currently active highlights and be able to clear each item separately
- [x] Fix bug where list items get duplicated on "next"/"prev"
- [x] Have a list of currently active digs and be able to clear each item separately

#### Todo
- [ ] Fix partial copy paste mistake i.e 'learly I should have a C' / 'Clearly I should have a C'
- [ ] Add additional info to README (re: data digging w/arrays, more complicated json)
- [ ] Handle clear when empty
- [ ] Handle initial auth page error?
- [ ] Make the page navigation less terrible?
- [ ] Take some nice screenshots for this README
- [ ] Data digging -> If digging again data bits are additive, fix this
- [ ] Data digging -> test dig in order to be able to refactor
- [ ] Data digging -> handle key list failures
- [ ] Data digging -> make radio options functional
- [ ] Better field validation?
- [ ] Show validation errors
