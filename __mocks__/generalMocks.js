// This mocks general things like browser APIs or scripts we include in our html.
// Runs once after jest setup.
// Modules can be mocked by using jest.mock('module') in your test or, if you
// (always) need specific behaviour, by putting a mock in this folder.

window.addEventListener = document.addEventListener = jest.fn((type, listener, options) => {
});

window.removeEventListener = document.removeEventListener = jest.fn((type, listener, options) => {
});
