// ---------------------------
// initialize global variables
// ---------------------------

// Server configuration: This code requires the server to have CORS enabled (edit httpd.conf appropriately) 

// set-up data object --> all key values will be the headers on the output csv
var thisData = {
  "subjID":[],
  "experimentName":[],
  "versionName": [],
  "sequenceName":[],
  "url":[],
  "selected_row": [],
  "windowWidth":[],
  "windowHeight":[],
  "screenWidth":[],
  "screenHeight":[],
  "startDate":[],
  "startTime":[],
  "trial": [],
  "stimulus_0":[],
  "stimulus_1":[],
  "duration": [],
  "actual_depth_0": [],
  "actual_depth_1": [],
  "discrim_choice": [],
  "trial_RT":[],
  "log_fixation": [],
  "log_sceneDuration1": [],
  "log_mask1": [],
  "log_sceneDuration2": [],
  "log_mask2": [],
  "unitSelection": [],
  "meanDepth_rating": [],
  "navigability_rating": [],
  "rated_stimulus": [],
  "rating_RT": []
};

// information flow: depth_duration_variables.csv --> url for participant --> counterbalancing csv indexed by url fragment --> sampled json path
// depth_duration_variables.csv is uploaded when publishing a batch --> This contains the url for each participant 

// Row of counterbalancing array to be sampled is stored in the url fragment (part after #)
var url = window.location.href 
var url_split = url.split("#")
var url_num = url_split[url_split.length - 1]

// set subject ID as a random 6 digit number
var subjID = randomIntFromInterval(100000, 999999);

// start time variables
var start = new Date;
var startDate = start.getMonth() + "-" + start.getDate() + "-" + start.getFullYear();
var startTime = start.getHours() + "-" + start.getMinutes() + "-" + start.getSeconds();

// initialize empty variables
var stimulus_0, stimulus_1, duration, actual_depth_0, actual_depth_1, discrim_choice, endExpTime, startExpTime, RT, log_fixation, log_sceneDuration1, log_mask1, log_sceneDuration2, log_mask2, reported_age, meanDepth_rating, navigability_rating, rated_stimulus, rating_RT; 

// unit preference variables 
var pref = false // unit preference has not been made
var unit = null

// constant timing variables 
var fixation_time = 500
var mask_time = 500  

var practice_trial = 0 // counter that references the index of the practice_seq variable 
// var practice_seq = JSON.parse('[{"sequence": "practice", "duration": 250, "depth_0": 3.05, "depth_1": 3.17, "image_path_target_0": "depth_discrimination_stimuli/000451_2014-06-08_16-20-19_260595134347_rgbf000126-resize_2/000451_2014-06-08_16-20-19_260595134347_rgbf000126-resize_2-target.png", "image_path_target_1": "depth_discrimination_stimuli/000079_2014-05-14_21-35-51_260595134347_rgbf000172-resize_4/000079_2014-05-14_21-35-51_260595134347_rgbf000172-resize_4-target.png", "mask_path": "masks/mask_33.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 750, "depth_0": 1.8, "depth_1": 2.0, "image_path_target_0": "depth_discrimination_stimuli/000344_2014-06-09_19-37-43_260595134347_rgbf000172-resize_3/000344_2014-06-09_19-37-43_260595134347_rgbf000172-resize_3-target.png", "image_path_target_1": "depth_discrimination_stimuli/000380_2014-06-09_16-03-21_260595134347_rgbf000074-resize_0/000380_2014-06-09_16-03-21_260595134347_rgbf000074-resize_0-target.png", "mask_path": "masks/mask_34.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 500, "depth_0": 4.7, "depth_1": 4.1, "image_path_target_0": "depth_discrimination_stimuli/000375_2014-06-08_11-17-29_260595134347_rgbf000133-resize_2/000375_2014-06-08_11-17-29_260595134347_rgbf000133-resize_2-target.png", "image_path_target_1": "depth_discrimination_stimuli/001033_2014-06-08_13-23-43_260595134347_rgbf000055-resize_1/001033_2014-06-08_13-23-43_260595134347_rgbf000055-resize_1-target.png", "mask_path": "masks/mask_35.jpg", "fixation_path": "fixation.jpg"}]')
var practice_seq = JSON.parse('[{"sequence": "practice", "duration": 250, "depth_0": 3.05, "depth_1": 3.17, "image_path_target_0": "depth_discrimination_practice_stimuli/000451_2014-06-08_16-20-19_260595134347_rgbf000126-resize_2/000451_2014-06-08_16-20-19_260595134347_rgbf000126-resize_2-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/000079_2014-05-14_21-35-51_260595134347_rgbf000172-resize_4/000079_2014-05-14_21-35-51_260595134347_rgbf000172-resize_4-target.png", "mask_path": "masks/mask_33.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 750, "depth_0": 1.8, "depth_1": 2.0, "image_path_target_0": "depth_discrimination_practice_stimuli/000344_2014-06-09_19-37-43_260595134347_rgbf000172-resize_3/000344_2014-06-09_19-37-43_260595134347_rgbf000172-resize_3-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/000380_2014-06-09_16-03-21_260595134347_rgbf000074-resize_0/000380_2014-06-09_16-03-21_260595134347_rgbf000074-resize_0-target.png", "mask_path": "masks/mask_34.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 500, "depth_0": 4.7, "depth_1": 4.1, "image_path_target_0": "depth_discrimination_practice_stimuli/000375_2014-06-08_11-17-29_260595134347_rgbf000133-resize_2/000375_2014-06-08_11-17-29_260595134347_rgbf000133-resize_2-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001033_2014-06-08_13-23-43_260595134347_rgbf000055-resize_1/001033_2014-06-08_13-23-43_260595134347_rgbf000055-resize_1-target.png", "mask_path": "masks/mask_35.jpg", "fixation_path": "fixation.jpg"}]')

var practiced = false // practice trials have not been completed 

var trial = 0 //counter that references the index of the stim_seq variable

var counter = 0 // counter for logging 

// counters for the scene property rating part of the experiment 
var rating_trial = 0
var rating_counter = 0

// 52 in v4 (44 real trials, 8 catch trial) // 88 in v2 / 96 trials in a full experiment 
var num_trials = 51 // 95 // since indexing starts at zero num_trial = actual total trials - 1
// 196 trials (192 real trials, 4 catch trials) // 192 trials in a full experiment 
var num_rating_trials = 2 // 195 // 191 

// solves problem of last practice variables being saved in the estimate variable and getting recorded 
// set to true once trial has actually begun NOT in the beginning of the function because the practice trial is still saved in the estimate variable
var start_recording = false 
var age_recorded = false

var start_recording_ratings = false 

// reads in counterbalancing csv and calls function to get sequence filepath 
var data = $.ajax({
                url: 'counterbalancing.csv',
                dataType: 'text',
              }).done(successFunction);


function successFunction(data) {
  // reads in CSV and converts to JS array
  var allRows = data.split(/\r?\n|\r/);
  var table = [];
  for (var singleRow = 0; singleRow < allRows.length; singleRow++) {
    var rowCells = allRows[singleRow].split(',');
    for (var rowCell = 0; rowCell < rowCells.length; rowCell++) {
      if (rowCell == 0){
        var table_row = []
      }                 
      table_row.push(rowCells[rowCell]);
    }
    table.push(table_row);

  }
  counterbalancing_array = table

  seq_filepath = counterbalancing_array[url_num][0]; // filepath is the first element of the row (passed in through URL)
  selected_row = url_num; // log which row was selected 
  console.log(seq_filepath)




  // ajax request for selected JSON (seq_filepath)
  stim_seq = $.ajax({ // loads in stimulus sequence from server
                          url: seq_filepath,
                          method: 'GET',
                          dataType: 'json',
                          data: JSON.stringify(),
                          success: function (data) {
                            stim_seq = data; 
                            sequenceName = seq_filepath // get sequence name, which is pushed in saveTrialData
                            preload(practice_seq, stim_seq); // calls function to preload all scene images 
                            preloadMasks(practice_seq, stim_seq); // calls function to preload all mask images 
                          },
                });
  // main list of all stimuli 
  ratings_seq = $.ajax({ // loads in stimulus sequence from server
                          url: "ratings_stimuli.json",
                          method: 'GET',
                          dataType: 'json',
                          data: JSON.stringify(),
                          success: function (data) {
                            ratings_seq = shuffle(data); 
                          },
                });
  // ratings_seq = shuffle(ratings_seq);

}


// ----------------
// set-up functions
// ----------------

$(document).ready(function(){

  // on open, add text to the startingInstructions div 
  $(".buttonDivPg2").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();

  $("#start_trials").hide()
  $(".startTrialsButtonDiv").hide();

  $("#meanDepth_response").hide();
  $("#navigability_response").hide();
  $("#cb_navigability_response").hide();
  $("#cb_meanDepth_response").hide();


  $("#Instructions2").hide();
  $("#restart_trials").hide();
  $("#restartTrialsButton").hide();
  $("#FinalInstructions").hide();


  $("#startingInstructions").append( 
    "<h1>Thank you for accepting this HIT!</h1>"
    + "<p>In this Human Intelligence Task (HIT), you are asked to make judgments about everyday objects and scenes. This psychology task takes about 20 minutes and you will be compensated $2.50 (roughly $7.50/hour).</p>"
    + "<p>This research is conducted by the Brain and Navigation Laboratory at the George Washington University (PI: Dr. John Philbeck). You may contact Dr. Philbeck at bnavlab2@gmail.com, or the George Washington University Institutional Review Board at (202) 994-2715.</p>"
    + "<p>This task can only be completed once. If you have already completed this task before the system will not allow you to run again. If this looks familiar please return the HIT so someone else can participate. </p>"
    + "<p>Otherwise, please click 'NEXT' to reveal further instructions and an informed consent agreement.</p>"
    );


  document.getElementById("subjID").value = subjID;
  document.getElementById("startDate").value = startDate;
  document.getElementById("startTime").value = startTime;

});


// INSTRUCTIONS & CONSENT - Before Practice // 


function showConsent(){
  $(".buttonDivPg2").show();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();



  $("#startingInstructions").hide();
  $("#Instructions2").hide();

  $("#FinalInstructions").hide()


  $("#getConsent").append( 
    "<h1>Title of Study: The Visual Determinants of Size in Natural Scenes </h1>"
    + "<br>IRB #: 04168<br/>"
    + "<br>Version Date: 7/09/20<br/>"

    + "<p>The purpose of this study is to investigate how people determine the size of objects in pictures of natural scenes.</p>"
    + "<p>If you choose to take part in this study, you will participate in a research activity that involves viewing a series of pictures and answering questions about them. For example, for each picture, you might be asked about the sizes or spatial relationships of objects in the scene, or what objects were present in the scene. The total amount of time you will spend in connection with this study is about 20 minutes, and you will receive $2.50 as compensation for your participation. You may refuse to answer any of the questions and you may stop your participation in this study at any time.</p>"
    + "<p>Possible risks or discomforts you could experience during this study include: boredom or loss of confidentiality (for example, depending on where you are, someone might see you taking part in the study). </p>"
    + "<p>You will not benefit directly from your participation in the study. The benefit to science and humankind that might result from this study is: a clearer understanding about how people perceive the size and spatial relationships among objects in natural scenes.</p>"
    + " <p> Every effort will be made to keep your information confidential, however, this cannot be guaranteed. We will not receive any information about you other than your responses to the study questions. If results of this research study are reported in journals or at scientific meetings, the people who participated in this study will not be named or identified. <p/>"
    + "<p> The Office of Human Research of George Washington University, at telephone number (202) 994-2715, can provide further information about your rights as a research participant.<p/>"
    + "<p> Your willingness to participate in this research study is implied if you proceed.<p/>"
    + "<p> Please click 'AGREE' if you have read the consent form and agree to participate. If you do not consent to participate, close this window.<p/>"
    );
}

function nextInstructions(){
  $("#getConsent").hide();
  $("#Instructions2").show();
  $("#FinalInstructions").hide()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").show();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
}

function finalInstructions(){
  $("#getConsent").hide();
  $("#Instructions2").hide();
  $("#FinalInstructions").show()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".metersButtonDiv").hide();
  $(".feetButtonDiv").hide();
  $(".buttonDivPg4").show()

  $("#FinalInstructions").append(
    "<h1> Part 1 Task Instructions: </h1>"
    + "<p>A fixation cross will appear in the center of the screen - focus on this cross. The image will then appear for a brief amount of time, so make sure you are watching closely as to not miss the target. Then, the scene and target will disappear, and you will see an image of colored squares. Once this image disappears you will briefly see a fixation cross followed by another image of a scene for a brief amount of time. This will again be followed by an image of colored squares.</p>"
    + "<p>Then you will see a red fixation cross, indicating that your response has not been given yet. Respond which image's target was closer to you - Image 1 or Image 2? Press the 'z' key on your keyboard to indicate Image 1 or press the 'm' key on your keyboard to indicate Image 2. As soon as you respond, the fixation cross will turn black and the next trial will begin.</p>"
    + "<b>Please respond as quickly and accurately as possible!</b>"
    + "<p> You will complete 52 trials total.</p>"
    + "<p> The experiment will begin with three practice trials. During the practice portion you will receive feedback on each trial. The next trial will start momentarily after you see the feedback. If you are ready to begin, please click 'BEGIN' below. </p>"
    )
}

function getUnits(){
  $("#getConsent").hide();
  $("#Instructions2").hide();
  $("#FinalInstructions").hide();
  $("#getUnits").show()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();
  $(".metersButtonDiv").show()
  $(".feetButtonDiv").show()

  $("#getUnits").append(
    "<p> For our reference, please select the unit of measurement you are most comfortable with.<p/>"
    )
}

function recordUnitsMeters(){
  pref = true // units have been chosen 
  unit = "meters"
  console.log(unit)

  $("#getUnits").hide()
  $(".metersButtonDiv").hide()
  $(".feetButtonDiv").hide()

  $(".startPracticeButtonDiv").show()

}

function recordUnitsFeet(){
  pref = true // units have been chosen 
  unit = "feet"
  console.log(unit)

  $("#getUnits").hide()
  $(".metersButtonDiv").hide()
  $(".feetButtonDiv").hide()
  $(".startPracticeButtonDiv").show()

}

function startPractice(){
  // not recording responses from practice trials 

  $(".startPracticeButtonDiv").hide()

  if (practice_trial > 2){
    practiced = true
    $("#start_trials").show()
    $(".startTrialsButtonDiv").show();
    $(".feedbackDiv").hide();

  }

  else{
    scene_duration = getTrialDuration();
    var fixation = showFixation();
    // Timing note: time accumulates so it is not actual duration but relative time
    // have to account for the time already spent
    var scene1 = setTimeout(function(){showScene1();}, fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask1();}, fixation_time + scene_duration); 
    var fixation2 = setTimeout(function(){showFixation();}, fixation_time + scene_duration + mask_time); 
    var scene2 = setTimeout(function(){showScene2();}, fixation_time + scene_duration + mask_time + fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask2 = setTimeout(function(){showMask2();}, fixation_time + scene_duration + mask_time + fixation_time + scene_duration); 
    var response = setTimeout(function(){getResponse();detectKeyPress();}, fixation_time + scene_duration + mask_time + fixation_time + scene_duration + mask_time)
  }
}

function runTrial(){ 

  $(".startPracticeButtonDiv").hide()
  $("#start_trials").hide()
  $(".startTrialsButtonDiv").hide();

  $("#restart_trials").hide();
  $("#restartTrialsButton").hide();


  if (start_recording == true){ // prevents the last practice trial from being recorded 
    var trial_params = getTrialParams();
    // [stimulus_0, stimulus_1, duration, actual_depth_0, actual_depth_1];
    stimulus_0 = trial_params[0]
    stimulus_1 = trial_params[1]

    duration = trial_params[2]

    actual_depth_0 = trial_params[3]
    actual_depth_1 = trial_params[4]

    console.log(discrim_choice, "dc")
    console.log(trial, "trial")

    saveTrialData();

    counter ++;
  }

  if (trial == 0){
    startExpTime = new Date; // get start time of first trial to calculate total experiment time
  }

  if (trial > num_trials){ 
    // endExpTime = new Date; //get time of end of last block to calculate total experiment time

    getAge();

  }

  else{
    start_recording = true; // start recording because practice trials are done 
    scene_duration = getTrialDuration();
    var fixation = showFixation();
    // Timing note: time accumulates so it is not actual duration but relative time
    // have to account for the time already spent
    var scene1 = setTimeout(function(){showScene1();}, fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask1();}, fixation_time + scene_duration); 
    var fixation2 = setTimeout(function(){showFixation();}, fixation_time + scene_duration + mask_time); 
    var scene2 = setTimeout(function(){showScene2();}, fixation_time + scene_duration + mask_time + fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask2 = setTimeout(function(){showMask2();}, fixation_time + scene_duration + mask_time + fixation_time + scene_duration); 
    var response = setTimeout(function(){getResponse();detectKeyPress();}, fixation_time + scene_duration + mask_time + fixation_time + scene_duration + mask_time)
  }
}

function showFixation(){
  startFixation = new Date; 

  f_path = "fixation.jpg"
  $("#fixation_image").attr("src", f_path)

  $(document).ready(function(){
    $(".fixationDiv").show();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".feedbackDiv").hide();
  })

}

function showScene1(){
  endFixation = new Date;
  log_fixation = endFixation - startFixation;

  if (practiced == false){
    var s_path_0 = practice_seq[practice_trial].image_path_target_0
    var s_duration = practice_seq[practice_trial].duration 
    var actual_depth_0 = stim_seq[trial].depth_0

  }
  else{ 
    startTrialTime = new Date; // time at which the scene is presented for a given trial 

    var s_path_0 = stim_seq[trial].image_path_target_0
    var s_duration = stim_seq[trial].duration 
    var actual_depth_0 = stim_seq[trial].depth_0
  }

  startSceneTimeLog1 = new Date; // time at which scene is presented 
  $("#scene_image").attr("src", s_path_0);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".maskDiv").hide();
    $(".sceneDiv").show();
    $(".feedbackDiv").hide();
  })

}

function showScene2(){
  endMaskTimeLog1 = new Date;
  log_mask1 = endMaskTimeLog1 - startMaskTimeLog1;

  startTrialTime = new Date; // time at which scene 2 is shown 

  if (practiced == false){
    var s_path_1 = practice_seq[practice_trial].image_path_target_1
    var s_duration = practice_seq[practice_trial].duration 
    var actual_depth_1 = stim_seq[trial].depth_1

  }
  else{ 
    // startTrialTime = new Date; // time at which the scene is presented for a given trial 

    var s_path_1 = stim_seq[trial].image_path_target_1
    var s_duration = stim_seq[trial].duration 
    var actual_depth_1 = stim_seq[trial].depth_1
  }

  startSceneTimeLog2 = new Date; // time at which scene is presented 
  $("#scene_image").attr("src", s_path_1);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".maskDiv").hide();
    $(".sceneDiv").show();
    $(".feedbackDiv").hide();
  })

}

function getTrialDuration(){ // from sequence json
  if (practiced == false){
    var stim_duration = practice_seq[practice_trial].duration
  }
  else{ 
    var stim_duration = stim_seq[trial].duration
  }
  return stim_duration
}

function showMask1(){
  startMaskTimeLog1 = new Date;

  if (practiced == false){
    var m_path = practice_seq[practice_trial].mask_path
  }
  else{ 
    var m_path = stim_seq[trial].mask_path
  }

  endSceneTimeLog1 = new Date;
  log_sceneDuration1 = endSceneTimeLog1 - startSceneTimeLog1;
  $("#mask_image").attr("src", m_path);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").show();
    $(".feedbackDiv").hide();
  })

}

function showMask2(){
  startMaskTimeLog2 = new Date;

  if (practiced == false){
    var m_path = practice_seq[practice_trial].mask_path
  }
  else{ 
    var m_path = stim_seq[trial].mask_path
  }

  endSceneTimeLog2 = new Date;
  log_sceneDuration2 = endSceneTimeLog2 - startSceneTimeLog2;
  $("#mask_image").attr("src", m_path);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").show();
    $(".feedbackDiv").hide();
  })

}

// https://www.w3schools.com/js/js_validation.asp
// depth estimate is validated in html response div

function getResponse(){
  endMaskTimeLog2 = new Date;
  log_mask2 = endMaskTimeLog2 - startMaskTimeLog2;

  red_f_path = "red_fixation.jpg"
  $("#red_fixation_image").attr("src", red_f_path)

  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".feedbackDiv").hide();
    $(".responseDiv").show();

  })

}

function detectKeyPress(){
	// see if key is pressed to end trial early

	// add event listener for keypress
	$(document).bind("keypress", function(event){
		if (event.key == 'm'){ 
			key = "m";
			discrim_choice = 1;
			endTrialTime = new Date; // time at which response has been given for past trial
    		RT = endTrialTime - startTrialTime;

			if (practiced == false) {
        var feedback = showFeedback();
        var next = setTimeout(function(){nextTrial();}, 4000); // the time here is how long it takes to show up NOT time on the screen

      }
      else{
        nextTrial(); //since button was pressed, move onto next trial
      }
		}
    if (event.key == '0'){ 
      key = "0";
      discrim_choice = 2;
      endTrialTime = new Date; // time at which response has been given for past trial
        RT = endTrialTime - startTrialTime;

      if (practiced == false) {
        var feedback = showFeedback();
        var next = setTimeout(function(){nextTrial();}, 4000); // the time here is how long it takes to show up NOT time on the screen

      }
      else{
        nextTrial(); //since button was pressed, move onto next trial
      }
    }
    else if (event.key == 'z'){ 
      key = "z";
      discrim_choice = 0;
      endTrialTime = new Date; // time at which response has been given for past trial
        RT = endTrialTime - startTrialTime;

      if (practiced == false) {
        var feedback = showFeedback();
        var next = setTimeout(function(){nextTrial();}, 4000); // the time here is how long it takes to show up NOT time on the screen

      }
      else{
        nextTrial(); //since button was pressed, move onto next trial
      }
    }
	});
} 

function showFeedback(){
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".responseDiv").hide();
    $(".feedbackDiv").show();

  })

  var correct_answers = [0,0,1]
  var trial_answer = correct_answers[practice_trial]

  if (discrim_choice == trial_answer){
      $("#feedback").empty().append("<b>Correct!</b>");
      // $("#feedback").append("<p>Correct!</p>");
  }
  else{
    if (trial_answer == 0){
      $("#feedback").empty().append("<b>Incorrect. The target in Image 1 was closer to you. Remember to respond which image's target was closer to you!</b>");
      // $("#feedback").append("<p>Incorrect. The target in Image 1 was closer to you. Remember to respond which image's target was closer to you!</p>");
    }

    else { 
      $("#feedback").empty().append("<b>Incorrect. The target in Image 2 was closer to you. Remember to respond which image's target was closer to you!</b>");
      // $("#feedback").append("<p>Incorrect. The target in Image 2 was closer to you. Remember to respond which image's target was closer to you!</p>");
    }
  }

}

function nextTrial(){ 

	$(document).unbind("keypress"); //assuming there has already been a keypress, remove event so it can be added for next trial

	if (practiced == false){
		practice_trial ++ 
		startPractice();
  	}
	else{ 
  		trial ++ 
  		runTrial();
  	}
  	$(".responseDiv").hide()
}


function getAge(){

  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".responseDiv").hide();
    $("#restart_trials").hide();
    $("#restartTrialsButton").hide();
    $("#age").show();


  })
  stimulus_0 = ""
  stimulus_1 = ""
  duration = ""
  actual_depth_0 = ""
  actual_depth_1 = ""
  discrim_choice = ""
  log_sceneDuration = ""


}

function getTrialParams(){ // returns trial parameters to be logged 
  var stimulus_0 = stim_seq[counter].image_path_target_0
  var stimulus_1 = stim_seq[counter].image_path_target_1

  var duration = stim_seq[counter].duration 
  var actual_depth_0 = stim_seq[counter].depth_0
  var actual_depth_1 = stim_seq[counter].depth_1

  return [stimulus_0, stimulus_1, duration, actual_depth_0, actual_depth_1];

}

function sceneRatingInstructions(){ 
  if (age_recorded == false){
    reported_age = document.getElementById("age_numb").value;

    saveTrialData();
    age_recorded = true
    trial ++ 
  }

  if (age_recorded == true){
    $("#age").hide() 
    $("#ratingsInstructions").show();
    $(".startRatingButtonDiv").show();

  }
}


function runRatingTrials(){

  $("#ratingsInstructions").hide();
  $(".startRatingButtonDiv").hide();


  if (start_recording_ratings == true){ 


    rated_stimulus = ratings_seq[rating_counter].image_path
    console.log(rated_stimulus, "rs")

    endRatingTrialTime = new Date; // time at which response has been given for past trial
    rating_RT = endRatingTrialTime - startRatingTrialTime;

    saveTrialData();

    rating_counter ++;

  }


  if (rating_trial > num_rating_trials){ 
    endExpTime = new Date; //get time of end of last block to calculate total experiment time

    lastInstructions();


  }

  else{
    console.log(rating_trial, "ratingtrial")

    start_recording_ratings = true; // start recording because practice trials are done 
    //check if the number is even
	if(url_num % 2 == 0) {
		getMeanDepthRating();
	    console.log("Mean depth first");
	}

	// if the number is odd
	else {
		cb_getNavigabilityRating();
	    console.log("Navigability first");
	}

    // getMeanDepthRating();
  }
}

function getMeanDepthRating(){
  startRatingTrialTime = new Date; // time at which the response page is available 
  var r_path = ratings_seq[rating_trial].image_path

  $(document).ready(function(){
  	$(".startRatingButtonDiv").hide();
    $(".meanDepth_responseDiv").show();
    $("#r_scene_image").attr("src", r_path);
    $(".r_sceneDiv").show();

  })

}

function getNavigabilityRating(md_rating){
  $(document).ready(function(){
  	$(".startRatingButtonDiv").hide();
    $(".navigability_responseDiv").show();

  })

  meanDepth_rating = md_rating;
}

function cb_getNavigabilityRating(){
  startRatingTrialTime = new Date; // time at which the response page is available 
  startTrialTime = new Date; // time at which the response page is available 
  var r_path = ratings_seq[rating_trial].image_path

  $(document).ready(function(){
  	$(".startRatingButtonDiv").hide();
  	$(".meanDepth_responseDiv").hide();
  	$(".navigability_responseDiv").hide();

    $(".cb_navigability_responseDiv").show();
    $("#r_scene_image").attr("src", r_path);
    $(".r_sceneDiv").show();

  })
}

function cb_getMeanDepthRating(nav_rating){
  $(document).ready(function(){
  	$(".startRatingButtonDiv").hide();
    $(".cb_meanDepth_responseDiv").show();

  })

  navigability_rating = nav_rating;
}


function lastInstructions(){ 
  // if (age_recorded == false){
  //   reported_age = document.getElementById("age_numb").value;
  //   saveTrialData();
  //   age_recorded = true
  // }

  if (age_recorded == true){
  	
  	$(".r_sceneDiv").hide();
  	$(".startRatingButtonDiv").hide();
    $("#ratingsInstructions").hide() 
    $("#lastBlockInstructions").append(
      "<p style='text-align:center'>Congratulations, you have finished the experiment. Thank you for your participation!</p>"
      +"<p style='text-align:center'>Click the button below to reveal your unique completion code.</p>")
    $("#lastBlockInstructions").show();
    $("#revealCodeButton").show();

  }
}


///////////////////////////////////////////////////////////////////////////////////////////////////////////////////


function endExperiment(){

  if (age_recorded == true){
    // gives participant their unique code and saves data to server --> this page should look identical to redirect html (revealCode.html)
    $("#lastBlockInstructions").append("<br><p style='text-align:center'><strong>Your unique completion code is: </strong>" +subjID+"</p>");
    $("#revealCodeButton").hide();
    saveAllData();
  }
}

// ---------------------
// saving data functions
// ---------------------

function saveTrialData(){
  // at the end of each trial, appends values to data dictionary

  // global variables --> will be repetitive, same value for every row (each row will represent one trial)
  thisData["subjID"].push(subjID);
  thisData["experimentName"].push("DepthScenes");
  thisData["versionName"].push("duration_discrimination");
  thisData["sequenceName"].push(sequenceName);
  thisData["url"].push(url);
  thisData["selected_row"].push(selected_row);
  thisData["windowWidth"].push($(window).width());
  thisData["windowHeight"].push($(window).height());
  thisData["screenWidth"].push(screen.width);
  thisData["screenHeight"].push(screen.height);
  thisData["startDate"].push(startDate);
  thisData["startTime"].push(startTime);
  thisData["unitSelection"].push(unit);

  // trial-by-trial variables, changes each time this function is called
  thisData["trial"].push(trial);
  thisData["stimulus_0"].push(stimulus_0);
  thisData["stimulus_1"].push(stimulus_1);
  thisData["duration"].push(duration);
  thisData["actual_depth_0"].push(actual_depth_0);
  thisData["actual_depth_1"].push(actual_depth_1);
  thisData["discrim_choice"].push(discrim_choice);
  thisData["trial_RT"].push(RT);
  thisData["log_fixation"].push(log_fixation);
  thisData["log_sceneDuration1"].push(log_sceneDuration1);
  thisData["log_mask1"].push(log_mask1);
  thisData["log_sceneDuration2"].push(log_sceneDuration2);
  thisData["log_mask2"].push(log_mask2);
  thisData["meanDepth_rating"].push(meanDepth_rating);
  thisData["navigability_rating"].push(navigability_rating);
  thisData["rated_stimulus"].push(rated_stimulus);
  thisData["rating_RT"].push(rating_RT);

}


function saveAllData() {
  // saves last pieces of data that needed to be collected at the end, and calls sendToServer function

  // add experimentTime and totalTime to data dictionary
  var experimentTime = (endExpTime - startExpTime);
  var totalTime = ((new Date()) - start);
  thisData["experimentTime"]=Array(trial).fill(experimentTime);
  thisData["totalTime"]=Array(trial).fill(totalTime);
  var age = reported_age;
  console.log('age', age)
  thisData["age"] = Array(trial).fill(age);

  // change values for input divs to pass to php
  $("#experimentData").val(JSON.stringify(thisData));
  $("#completedTrialsNum").val(trial); //how many trials this participant completed

  sendToServer();
  console.log("save all data")
}

function sendToServer() {
  // send the data to the server as string (which will be parsed IN php)

  $.ajax({ //same as $.post, but allows for more options to be specified
    headers:{"Access-Control-Allow-Origin": "*", "Content-Type": "text/csv"}, //headers for request that allow for cross-origin resource sharing (CORS)
    type: "POST", //post instead of get because data is being sent to the server
    url: $("#saveData").attr("action"), //url to php
    data: $("#experimentData").val(),  

    // if it works OR fails, submit the form
    success: function(){
      document.forms[0].submit();
    },
    error: function(){
      document.forms[0].submit();
    }
  });
}

// ----------------------
// other random functions
// ----------------------

function shuffle(o){
    for(var j, x, i = o.length; i; j = Math.floor(Math.random() * i), x = o[--i], o[i] = o[j], o[j] = x);
    return o;
}

function getRandomInt(max) {
  return Math.floor(Math.random() * Math.floor(max));
}

function randomIntFromInterval(min, max) { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min);
}