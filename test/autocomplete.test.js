// Helper handler for async code prior to running assersion
const waitFor = (selector) => {
  return new Promise((resolve, reject) => {
    // Check the DOM if an element with that selector has appeared
    const interval = setInterval(() => {
      if (document.querySelector(selector)) {
        clearInterval(interval);
        clearTimeout(timeout);
        resolve();
      }
    }, 30);

    const timeout = setTimeout(() => {
      clearInterval(interval);
      reject();
    }, 2000);
  });
};

// Globally defined by Mocha.  Hook executed before every it() statement.
beforeEach(() => {
  document.querySelector("#target").innerHTML = "";

  createAutoComplete({
    root: document.querySelector("#target"),
    fetchData() {
      return [
        { Title: "Avengers" },
        { Title: "Not Avengers" },
        { Title: "Some Other Movie" },
      ];
    },
    renderOption(movie) {
      return `<div>${movie.Title}</div>`;
    },
  });
});

it("Dropdown starts closed", () => {
  const dropdown = document.querySelector(".dropdown");

  expect(dropdown.className).not.to.include("is-active"); // chai.expect
});

it("After searching, dropdown opens up", async () => {
  // Fake test text inside of search input.  Note this does not trigger an event.  Manually fake an event.
  const input = document.querySelector(".input");
  input.value = "Avengers";
  input.dispatchEvent(new Event("input"));

  await waitFor(".dropdown-item");

  const dropdown = document.querySelector(".dropdown");

  expect(dropdown.className).to.include("is-active"); // chai.expect
});

it("After searching, displays some results", async () => {
  const input = document.querySelector(".input");
  input.value = "Avengers";
  input.dispatchEvent(new Event("input"));

  await waitFor(".dropdown-item");

  const items = document.querySelectorAll(".dropdown-item");

  expect(items.length).to.equal(3);
});

/*
  waitFor()
  - note that when the 'input' event is fired it takes some time due to debounce
  - so to solve we will wait for a selector to show up before we run the assertion lines after.
*/
