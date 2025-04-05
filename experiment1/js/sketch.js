// sketch.js - purpose and description here
// Author: Your Name
// Date:

const fillers = {
  userPre: ["Young", "Dumb", "Red", "Flashy", "Ur", "Silly", "Scrungle", "Capable", "Open", "Anti", "Dragon", "No", "Slick"],
  userPost: ["Dog", "Guy", "Slime", "", "Fish", "Nerd", "Employee", "Blue", "Sorceress", "Ruby", "Person", "Sloth", "Shark", "Jock"],
  userNum: ["1","","2","3","4","5","6","7","8","9","69","420","1776","55","12345"],
  number: ["1","2","3","4","5","6","7","8","9","10","11","12","13","14","15","16","17","18","19","20","21","22","23"],
  time: ["Seconds","Minutes","Hours","Hours","Days","Weeks","Months"],
  commentStart: ["Wow this is really ", "Hmm maybe you shouldnt do this. its ", "I hated this! its ", "I LOVE THIS SO MUCH! I love videos that are ", "Epic! ", "Maybe YouTube isnt for you. This video is ", "You should post more! ","This made me feel ", "Ugh, this is just ", "I'm obsessed with content that's ", "Why did you even post this? It's so ", "Keep 'em coming! This was ", "Not my thing. Kinda ", "Absolutely wild. It's just so ", "This gave me chills, it's so ", "I can't stop watching, it's so ", "Please stop. This is too "],
  commentEnd: ["amazing.", "awful!", "scary.", "entertaining.", "disgusting.", "educational.", "alright.", "lovely.", "a breath of fresh air", "epic", "10/10", "unoriginal.", "next level.", "heartwarming.", "cringe.", "underrated.", "overrated.", "the worst thing I've seen today.", "exactly what I needed.", "kinda mid.", "an emotional rollercoaster."]
};

const template = `@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
----------------------------------------------------------------
@$userPre$userPost$userNum ($number $time ago): 
$commentStart$commentEnd
`;

// STUDENTS: You don't need to edit code below this line.

const slotPattern = /\$(\w+)/;

function replacer(match, name) {
  let options = fillers[name];
  if (options) {
    return options[Math.floor(Math.random() * options.length)];
  } else {
    return `<UNKNOWN:${name}>`;
  }
}

function generate() {
  let story = template;
  while (story.match(slotPattern)) {
    story = story.replace(slotPattern, replacer);
  }

  /* global box */
  box.innerText = story;
}

/* global clicker */
clicker.onclick = generate;

generate();
