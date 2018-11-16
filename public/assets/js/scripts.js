// Initialize all of the Materialize Components.
// You cannot pass in options using this method.
M.AutoInit();

// Toggle the little dropdown arrows in the sidenav
$(".tog-button").on("click", function () {
  if ($(".tog-arrow").css("transform") == "none") {
    $(".tog-arrow").css({ "transform": "rotate(180deg)" });
  } else {
    $(".tog-arrow").css({ "transform": "" });
  };
})

// Smoothscroll from W3Schools
$("a").on('click', function (event) {

  // Make sure this.hash has a value before overriding default behavior
  if (this.hash !== "") {
    // Prevent default anchor click behavior
    event.preventDefault();

    // Store hash
    var hash = this.hash;

    // Using jQuery's animate() method to add smooth page scroll
    // The optional number (800) specifies the number of milliseconds it takes to scroll to the specified area
    $('html, body').animate({
      scrollTop: $(hash).offset().top
    }, 800, function () {

      // Add hash (#) to URL when done scrolling (default click behavior)
      window.location.hash = hash;
    });
  } // End if
});


//This function GETs all ideas for a group so that the data can be passed to handlebars to render them on the page.
let getAllIdeasForTheGroup = (groupId) => {

  $.ajax({
      url: "/api/ideas/groups/" + 1, //groupId, //CHANGED TO TAKE IN PARAMETER INSTEAD OF HARD CODED.
      method: "GET"
  })
  .then(function (data) {
    console.log(data);
      renderHandlebarsTemplate(".display-ideas", "#group-ideas-display-template", {idea: data});
  });
}

//This Function takes the data from the API and uses handlebars to display on screen
let renderHandlebarsTemplate = (displayClass, templateId, data) => {
  let source = $(templateId).text();
  let template = Handlebars.compile(source);
  let html = template(data);
  $(displayClass).html(html);
}

//This function is GETing the current vote_value from the db of the idea that's clicked 
//It's then adding 1 to that value and passing that new value into the updateVoteValInDB function that will
//then update the vote_val in the db with the new value. 
//This function is called in the click handler below.
let getCurrentVoteVal = (ideaId) => {

  $.ajax({
    url: "/api/ideas/" + ideaId,
    method: "GET"
})
.then(function (data) {
  
 let currentVoteVal = data.vote_val;
 console.log("Current Vote_val " + currentVoteVal);

 let newVoteVal = currentVoteVal + 1;  
console.log("New Vote_val " + newVoteVal);

updateVoteValInDB(ideaId, newVoteVal);

});

}

//This function just updates the vote_value in the db of an idea that's been "voted for." This function is called in the 
//the promise of the getCurrentVoteVal function above. 
let updateVoteValInDB = (ideaId, newVoteVal) => {

  $.ajax({
    url: "/api/ideas/" + ideaId,
    method: "PUT",
    data: {
      vote_val: newVoteVal
    }
})
.then(function (data) {
  console.log(data);

});

}

//This function is Getting all the ideas from a group and pushing their vote_vals into an array.
//This makes it easy to use Math.max() to find out what the largest vote_vale is.
let findIdeaWithMostVotes = (groupId) => {
  let voteValArr = [];
  $.ajax({
    url: "/api/ideas/groups/" + 1, //CHANGED TO TAKE IN PARAMETER INSTEAD OF HARD CODED.
    method: "GET"
})
.then(function (data) {
  console.log(data);

      for (let i = 0; i < data.length; i++) {
        voteValArr.push(data[i].vote_val);
      }
  let maxVoteVal = Math.max(...voteValArr); 
    displayIdeasWithMostVotes(maxVoteVal);
});

}

//This function call an api endpoint that allows you to GET ideas by theire vote_val. I'm passing the max vote_val  from the 
// function findIdeaWithMostVotes function above so that handlebars can be used in this function to display that idea on the page.
let displayIdeasWithMostVotes = (groupId, maxVoteVal) => {
  $.ajax({
    url: "/api/ideas/groups/" + 1 + "/votes/" + maxVoteVal, //CHANGED TO TAKE IN PARAMETER INSTEAD OF HARD CODED.
    method: "GET"
})
.then(function (data) {
  renderHandlebarsTemplate(".display-winner", "#group-winner-display-template", {idea: data});
});
}

//This functions renders all the ideas from a particular group on the voting page.
getAllIdeasForTheGroup();
//This is the function that displays the winning idea on the page
findIdeaWithMostVotes();

$("body").on("click", ".add-vote", function(event){
  let ideaId = $(this).attr("data-idea-id");
  getCurrentVoteVal(ideaId);
  
  $(this).addClass("orange");
  
  $(this).find(".multi-vote").css("display", "block");
  
  $(this).find(".act-q").css("border-left", "5px solid #2c2f4d");

}); // end click func


// displayGroupInfo
  $.ajax({
    url: "/api/groups/",
    method: "GET"
  })
  .then(function(response){
    renderHandlebarsTemplate(".gn", "#group-ideas-display-template", { group: response[0].group_name });

    
  })// displayGroupInfo

  // display decideOnInfo
  $.ajax({
    url: "/api/groups/",
    method: "GET"
  })
    .then(function (response) {
    
      renderHandlebarsTemplate(".gi", "#group-ideas-display-template", { groupIdea: response[0].decide_on });

    })// display decideOnInfo


//This function receives the group object and then posts it to the /api/groups route.
let postGroupInformation = (group) => {
  $.post("/api/groups", group)
    .then(function(data) {
      console.log(data);
      getGroupByPassword(data.password);
    });
}

//This function GETs group information based on the password.
let getGroupByPassword = (groupPassword) => {
  $.get("/api/groups/password/" + groupPassword, function(data, status){
    console.log("Data: " + data.id + "\nStatus: " + status);
    //HERE IS OUR ONE LINE OF CODE THAT REDIRECTS US TO A NEW LOCATION.
    //THE VALUE OF location.href CAN ALSO BE A URL.
    location.href = "/ideas/group/" + data.id;
    //THIS could be a potential solution to render ideas
    // $(window).on("load", getAllIdeasForTheGroup(data.id));
    //Simpler solution if it works.
    // getAllIdeasForTheGroup(data.id)
  });
}

//This function handles taking information from input fields and creating an object
//to post in our groups table.
$("body").on("click", ".createGroup", function(event){
  var groupToPost = {
    admin_name:$("#admin_name").val().trim(),
    admin_email:$("#admin_email").val().trim(),
    decide_on:$("#decide_on").val().trim(),
    group_name:$("#group_name").val().trim(),
    password:$("#password_create").val().trim(),
  };
  postGroupInformation(groupToPost);
  
  //Used for testing so that I do not have to post groups to check if function is working
  // getGroupByPassword("8769341a");
});

//This function handles clicking the joingroup button, which uses the password from the input to
//GET the group ID by password.
$("body").on("click", ".joinGroup", function(event){
  var password = $("#passSearch").val().trim()
  getGroupByPassword(password);
});

// multiple votes on one idea

