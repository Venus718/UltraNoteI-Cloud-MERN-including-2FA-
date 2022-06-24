### Socket integraion

**FrontEnd Changes**

- Use socket-io-client npm package 
- Create Socket Context, to access sokcet connection anywhere in the app
- Connects User with Socket on Login or on Page Refresh
- Add Message event Listener on Header Component, and update messages state on new message arrival
- Add Background color for unread message
- Add an Api call to get unread message count on User login
- Add an Api call on reading an unread message
- Change states on reading any unread message

**Back-End Changes**

- Use Socket npm package
- Create socket Connection
- Emit an event on new Message creation
- Add `isRead` column in Messages table
- Created Two new API's-> one for fetching unread messages count and other for
  updating `isRead` value    