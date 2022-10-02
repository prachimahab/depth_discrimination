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
var practice_seq = JSON.parse('[{"sequence": "practice", "duration": 1000, "depth_0": 1.8, "depth_1": 3.98, "image_path_target_0": "depth_discrimination_practice_stimuli/000396_2014-06-08_12-56-14_260595134347_rgbf000180-resize_1/000396_2014-06-08_12-56-14_260595134347_rgbf000180-resize_1-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001026_2014-06-08_13-11-39_260595134347_rgbf000149-resize_4/001026_2014-06-08_13-11-39_260595134347_rgbf000149-resize_4-target.png", "mask_path": "masks/mask_1.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 1000, "depth_0": 4.2, "depth_1": 2.29, "image_path_target_0": "depth_discrimination_practice_stimuli/001094_2014-06-15_17-36-00_260595134347_rgbf000205-resize_0/001094_2014-06-15_17-36-00_260595134347_rgbf000205-resize_0-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/000690_2014-06-08_13-06-36_260595134347_rgbf000066-resize_4/000690_2014-06-08_13-06-36_260595134347_rgbf000066-resize_4-target.png", "mask_path": "masks/mask_2.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 250, "depth_0": 3.07, "depth_1": 1.7, "image_path_target_0": "depth_discrimination_practice_stimuli/001118_2014-06-15_17-31-22_260595134347_rgbf000195-resize_1/001118_2014-06-15_17-31-22_260595134347_rgbf000195-resize_1-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001110_2014-06-15_17-25-28_260595134347_rgbf000150-resize_1/001110_2014-06-15_17-25-28_260595134347_rgbf000150-resize_1-target.png", "mask_path": "masks/mask_3.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 250, "depth_0": 1.69, "depth_1": 3.9, "image_path_target_0": "depth_discrimination_practice_stimuli/001132_2014-06-17_14-48-54_260595134347_rgbf000100-resize_8/001132_2014-06-17_14-48-54_260595134347_rgbf000100-resize_8-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001282_2014-06-16_16-20-27_260595134347_rgbf000183-resize_0/001282_2014-06-16_16-20-27_260595134347_rgbf000183-resize_0-target.png", "mask_path": "masks/mask_4.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 1000, "depth_0": 1.93, "depth_1": 4.03, "image_path_target_0": "depth_discrimination_practice_stimuli/001219_2014-06-17_16-20-25_260595134347_rgbf000111-resize_3/001219_2014-06-17_16-20-25_260595134347_rgbf000111-resize_3-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001150_2014-06-17_15-27-34_260595134347_rgbf000108-resize_2/001150_2014-06-17_15-27-34_260595134347_rgbf000108-resize_2-target.png", "mask_path": "masks/mask_5.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 250, "depth_0": 4.11, "depth_1": 1.9, "image_path_target_0": "depth_discrimination_practice_stimuli/001264_2014-06-16_16-10-23_260595134347_rgbf000109-resize_3/001264_2014-06-16_16-10-23_260595134347_rgbf000109-resize_3-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001244_2014-06-17_16-47-45_260595134347_rgbf000030-resize_1/001244_2014-06-17_16-47-45_260595134347_rgbf000030-resize_1-target.png", "mask_path": "masks/mask_6.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 1000, "depth_0": 3.77, "depth_1": 3.29, "image_path_target_0": "depth_discrimination_practice_stimuli/001604_2014-06-20_11-17-57_260595134347_rgbf000035-resize_1/001604_2014-06-20_11-17-57_260595134347_rgbf000035-resize_1-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001879_2014-06-22_13-49-56_260595134347_rgbf000029-resize_2/001879_2014-06-22_13-49-56_260595134347_rgbf000029-resize_2-target.png", "mask_path": "masks/mask_7.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 250, "depth_0": 1.73, "depth_1": 1.95, "image_path_target_0": "depth_discrimination_practice_stimuli/002057_2014-06-24_21-00-13_260595134347_rgbf000120-resize_2/002057_2014-06-24_21-00-13_260595134347_rgbf000120-resize_2-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/001650_2014-06-20_12-09-00_260595134347_rgbf000087-resize_3/001650_2014-06-20_12-09-00_260595134347_rgbf000087-resize_3-target.png", "mask_path": "masks/mask_8.jpg", "fixation_path": "fixation.jpg"}, {"sequence": "practice", "duration": 1000, "depth_0": 2.36, "depth_1": 2.69, "image_path_target_0": "depth_discrimination_practice_stimuli/002342_2014-06-28_20-06-12_260595134347_rgbf000075-resize_0/002342_2014-06-28_20-06-12_260595134347_rgbf000075-resize_0-target.png", "image_path_target_1": "depth_discrimination_practice_stimuli/002415_2014-06-28_20-25-08_260595134347_rgbf000075-resize_0/002415_2014-06-28_20-25-08_260595134347_rgbf000075-resize_0-target.png", "mask_path": "masks/mask_9.jpg", "fixation_path": "fixation.jpg"}]')

var practiced = false // practice trials have not been completed 
var practice_acc = 0
var secondPractice = false // practice trials have only been completed once 

var practice_performance = []

var trial = 0 //counter that references the index of the stim_seq variable

var counter = 0 // counter for logging 

// counters for the scene property rating part of the experiment 
var rating_trial = 0
var rating_counter = 0

// 40 in v5 (32 real trials, 8 catch trial) // 88 in v2 / 96 trials in a full experiment 
var num_trials = 39 // 39 // since indexing starts at zero num_trial = actual total trials - 1
// 196 trials (192 real trials, 4 catch trials) // 192 trials in a full experiment 
var num_rating_trials = 195 // 195 // 191 

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

var practice_positions = {'001879_2014-06-22_13-49-56_260595134347_rgbf000029-resize_2': 297,
 '001026_2014-06-08_13-11-39_260595134347_rgbf000149-resize_4': 123,
 '000690_2014-06-08_13-06-36_260595134347_rgbf000066-resize_4': 280,
 '002342_2014-06-28_20-06-12_260595134347_rgbf000075-resize_0': 123,
 '001244_2014-06-17_16-47-45_260595134347_rgbf000030-resize_1': 210,
 '001132_2014-06-17_14-48-54_260595134347_rgbf000100-resize_8': 307,
 '002057_2014-06-24_21-00-13_260595134347_rgbf000120-resize_2': 358,
 '001650_2014-06-20_12-09-00_260595134347_rgbf000087-resize_3': 422,
 '000515_2014-06-09_16-14-35_260595134347_rgbf000090-resize_4': 41,
 '001150_2014-06-17_15-27-34_260595134347_rgbf000108-resize_2': 50,
 '001110_2014-06-15_17-25-28_260595134347_rgbf000150-resize_1': 255,
 '000496_2014-06-08_22-50-40_260595134347_rgbf000056-resize_5': 367,
 '001264_2014-06-16_16-10-23_260595134347_rgbf000109-resize_3': 111,
 '002415_2014-06-28_20-25-08_260595134347_rgbf000075-resize_0': 51,
 '001219_2014-06-17_16-20-25_260595134347_rgbf000111-resize_3': 317,
 '001118_2014-06-15_17-31-22_260595134347_rgbf000195-resize_1': 88,
 '001064_2014-06-08_21-58-08_260595134347_rgbf000097-resize_2': 280,
 '000396_2014-06-08_12-56-14_260595134347_rgbf000180-resize_1': 306,
 '001282_2014-06-16_16-20-27_260595134347_rgbf000183-resize_0': 145,
 '003086_2014-06-15_15-24-53_094959634447_rgbf000150-resize_3': 230,
 '001604_2014-06-20_11-17-57_260595134347_rgbf000035-resize_1': 264,
 '001094_2014-06-15_17-36-00_260595134347_rgbf000205-resize_0': 82}

var positions = {'000866_2014-06-09_20-45-42_260595134347_rgbf000139-resize_1': 91,
 '002987_2014-06-08_18-48-20_094959634447_rgbf000022-resize_0': 199,
 '001417_2014-06-19_16-25-36_260595134347_rgbf000115-resize_5': 168,
 '003070_2014-06-15_14-58-27_094959634447_rgbf000150-resize_3': 192,
 '001092_2014-06-15_17-34-58_260595134347_rgbf000171-resize_3': 277,
 '002272_2014-06-28_18-53-56_260595134347_rgbf000067-resize_2': 340,
 '002700_2014-06-22_11-27-02_094959634447_rgbf000124-resize_3': 166,
 '000642_2014-06-08_16-59-25_260595134347_rgbf000098-resize_2': 238,
 '002549_2014-06-24_13-41-39_094959634447_rgbf000022-resize_3': 319,
 '000009_2014-05-26_14-32-05_260595134347_rgbf000034-resize_3': 50,
 '002570_2014-06-24_13-59-54_094959634447_rgbf000059-resize_0': 110,
 '000505_2014-06-08_23-03-23_260595134347_rgbf000091-resize_0': 350,
 '002988_2014-06-15_12-24-20_094959634447_rgbf000150-resize_1': 82,
 '001815_2014-06-26_20-52-55_260595134347_rgbf000020-resize_0': 73,
 '001498_2014-06-19_17-45-14_260595134347_rgbf000129-resize_4': 346,
 '002949_2014-06-26_15-57-42_094959634447_rgbf000079-resize_1': 250,
 '000549_2014-06-08_22-10-24_260595134347_rgbf000247-resize_3': 382,
 '001188_2014-06-17_15-54-10_260595134347_rgbf000090-resize_2': 133,
 '000506_2014-06-08_23-21-00_260595134347_rgbf000070-resize_7': 164,
 '000953_2014-06-08_11-42-19_260595134347_rgbf000083-resize_0': 460,
 '002725_2014-06-22_11-47-51_094959634447_rgbf000070-resize_1': 112,
 '000109_2014-05-14_23-41-52_260595134347_rgbf000035-resize_9': 387,
 '002875_2014-06-01_15-19-00_094959634447_rgbf000151-resize_1': 43,
 '000810_2014-06-08_17-20-01_260595134347_rgbf000105-resize_0': 265,
 '000502_2014-06-08_23-02-32_260595134347_rgbf000063-resize_4': 284,
 '000469_2014-06-09_19-42-10_260595134347_rgbf000081-resize_1': 279,
 '001724_2014-06-26_19-28-50_260595134347_rgbf000037-resize_7': 215,
 '000635_2014-06-08_16-38-42_260595134347_rgbf000106-resize_1': 145,
 '002678_2014-06-13_16-15-32_094959634447_rgbf000151-resize_6': 120,
 '001012_2014-06-08_23-19-38_260595134347_rgbf000057-resize_0': 471,
 '001650_2014-06-20_12-09-00_260595134347_rgbf000087-resize_3': 422,
 '000929_2014-06-09_16-33-19_260595134347_rgbf000139-resize_0': 235,
 '003125_2014-05-12_10-39-22_094959634447_rgbf000100-resize_0': 89,
 '001392_2014-06-19_16-07-59_260595134347_rgbf000046-resize_1': 107,
 '000665_2014-06-09_20-42-35_260595134347_rgbf000110-resize_1': 244,
 '000436_2014-06-09_22-25-11_260595134347_rgbf000137-resize_1': 97,
 '001148_2014-06-17_15-26-42_260595134347_rgbf000129-resize_0': 63,
 '000742_2014-06-08_18-48-09_260595134347_rgbf000164-resize_4': 101,
 '001029_2014-06-08_13-17-57_260595134347_rgbf000065-resize_1': 156,
 '003492_2014-05-21_15-50-55_094959634447_rgbf000828-resize_1': 152,
 '000943_2014-06-09_19-31-07_260595134347_rgbf000128-resize_1': 240,
 '000137_2014-05-20_17-04-49_260595134347_rgbf000120-resize_1': 86,
 '002784_2014-06-22_19-26-30_094959634447_rgbf000083-resize_3': 369,
 '002953_2014-06-08_17-32-18_094959634447_rgbf000059-resize_5': 354,
 '000720_2014-06-08_18-37-27_260595134347_rgbf000203-resize_4': 263,
 '001066_2014-06-08_22-03-20_260595134347_rgbf000066-resize_4': 60,
 '003395_2014-05-20_15-39-18_094959634447_rgbf000101-resize_0': 52,
 '003338_2014-05-20_11-01-23_094959634447_rgbf000051-resize_6': 330,
 '002579_2014-06-24_14-08-03_094959634447_rgbf000061-resize_2': 214,
 '000749_2014-06-08_21-55-06_260595134347_rgbf000070-resize_2': 192,
 '001170_2014-06-17_15-43-44_260595134347_rgbf000096-resize_6': 406,
 '000709_2014-06-08_13-51-55_260595134347_rgbf000068-resize_3': 70,
 '000692_2014-06-08_13-09-42_260595134347_rgbf000199-resize_2': 148,
 '002136_2014-06-25_21-18-03_260595134347_rgbf000109-resize_3': 252,
 '002340_2014-06-28_20-05-46_260595134347_rgbf000113-resize_0': 70,
 '002464_2014-06-28_20-36-57_260595134347_rgbf000029-resize_0': 101,
 '000457_2014-06-08_16-52-43_260595134347_rgbf000199-resize_1': 137,
 '001136_2014-06-17_15-19-41_260595134347_rgbf000076-resize_3': 100,
 '000191_2014-05-12_17-07-38_260595134347_rgbf000199-resize_0': 25,
 '001016_2014-06-09_16-16-10_260595134347_rgbf000112-resize_5': 150,
 '000368_2014-06-09_15-53-01_260595134347_rgbf000155-resize_2': 370,
 '001150_2014-06-17_15-27-34_260595134347_rgbf000108-resize_2': 50,
 '002199_2014-06-28_18-33-56_260595134347_rgbf000074-resize_0': 343,
 '002637_2014-06-24_14-51-13_094959634447_rgbf000066-resize_4': 161,
 '000454_2014-06-08_16-37-28_260595134347_rgbf000048-resize_2': 408,
 '002905_2014-06-03_18-04-43_094959634447_rgbf000151-resize_2': 257,
 '003288_2014-05-14_21-50-30_094959634447_rgbf000028-resize_3': 193,
 '003292_2014-05-14_21-53-49_094959634447_rgbf000100-resize_2': 230,
 '002209_2014-06-28_18-36-10_260595134347_rgbf000051-resize_1': 267,
 '003587_2014-05-23_16-48-02_094959634447_rgbf002384-resize_2': 415,
 '001449_2014-06-19_17-01-27_260595134347_rgbf000116-resize_2': 129,
 '003546_2014-05-22_15-48-53_094959634447_rgbf004816-resize_3': 365,
 '001164_2014-06-17_15-35-46_260595134347_rgbf000085-resize_3': 106,
 '001110_2014-06-15_17-25-28_260595134347_rgbf000150-resize_1': 255,
 '002364_2014-06-28_20-11-05_260595134347_rgbf000042-resize_0': 70,
 '000830_2014-06-04_19-49-31_260595134347_rgbf000096-resize_2': 360,
 '003010_2014-06-15_12-54-35_094959634447_rgbf000112-resize_0': 125,
 '002118_2014-06-25_20-32-08_260595134347_rgbf000078-resize_1': 282,
 '002153_2014-06-25_21-27-18_260595134347_rgbf000038-resize_5': 303,
 '001540_2014-06-20_17-01-05_260595134347_rgbf000086-resize_2': 289,
 '001032_2014-06-08_13-23-17_260595134347_rgbf000021-resize_3': 277,
 '002657_2014-06-13_15-29-54_094959634447_rgbf000150-resize_1': 213,
 '002663_2014-06-13_15-50-26_094959634447_rgbf000075-resize_1': 44,
 '003129_2014-05-12_10-48-10_094959634447_rgbf000100-resize_0': 107,
 '000103_2014-05-14_22-01-17_260595134347_rgbf000152-resize_5': 192,
 '002675_2014-06-13_16-08-49_094959634447_rgbf000151-resize_2': 154,
 '001133_2014-06-17_14-49-16_260595134347_rgbf000100-resize_0': 178,
 '000470_2014-06-09_19-42-40_260595134347_rgbf000094-resize_1': 251,
 '001158_2014-06-17_15-32-16_260595134347_rgbf000138-resize_2': 119,
 '002344_2014-06-28_20-06-29_260595134347_rgbf000030-resize_1': 430,
 '000486_2014-06-09_20-47-20_260595134347_rgbf000143-resize_2': 112,
 '000854_2014-06-09_19-43-13_260595134347_rgbf000066-resize_0': 205,
 '002039_2014-06-24_20-22-38_260595134347_rgbf000084-resize_1': 71,
 '000569_2014-06-09_22-51-47_260595134347_rgbf000141-resize_3': 88,
 '002103_2014-06-25_20-00-40_260595134347_rgbf000049-resize_0': 75,
 '001570_2014-06-20_17-21-09_260595134347_rgbf000135-resize_4': 21,
 '000522_2014-06-08_13-35-06_260595134347_rgbf000244-resize_1': 356,
 '001450_2014-06-19_17-02-03_260595134347_rgbf000203-resize_4': 68,
 '002788_2014-06-22_19-36-03_094959634447_rgbf000088-resize_2': 139,
 '002213_2014-06-28_18-37-58_260595134347_rgbf000055-resize_1': 70,
 '001617_2014-06-20_11-35-32_260595134347_rgbf000066-resize_1': 64,
 '002365_2014-06-28_20-11-21_260595134347_rgbf000102-resize_1': 83,
 '002072_2014-06-24_21-48-06_260595134347_rgbf000115-resize_0': 140,
 '000375_2014-06-08_11-17-29_260595134347_rgbf000133-resize_2': 60,
 '000787_2014-06-08_22-33-53_260595134347_rgbf000175-resize_1': 74,
 '003495_2014-05-21_16-01-51_094959634447_rgbf000100-resize_3': 388,
 '002660_2014-06-13_15-44-18_094959634447_rgbf001878-resize_2': 195,
 '001806_2014-06-26_20-50-20_260595134347_rgbf000091-resize_1': 329,
 '002444_2014-06-28_20-32-08_260595134347_rgbf000027-resize_0': 143,
 '003423_2014-05-21_10-23-26_094959634447_rgbf002665-resize_2': 264,
 '001059_2014-06-08_21-53-27_260595134347_rgbf000061-resize_4': 228,
 '003534_2014-05-22_15-06-10_094959634447_rgbf000102-resize_4': 404,
 '001244_2014-06-17_16-47-45_260595134347_rgbf000030-resize_4': 163,
 '000682_2014-06-08_23-14-58_260595134347_rgbf000041-resize_5': 282,
 '001197_2014-06-17_16-01-50_260595134347_rgbf000103-resize_4': 170,
 '000917_2014-06-09_22-45-29_260595134347_rgbf000149-resize_3': 60,
 '002989_2014-06-15_12-25-03_094959634447_rgbf000150-resize_3': 53,
 '001100_2014-06-15_17-46-26_260595134347_rgbf000225-resize_2': 338,
 '000521_2014-06-08_13-34-35_260595134347_rgbf000191-resize_2': 312,
 '000556_2014-06-09_22-42-56_260595134347_rgbf000214-resize_1': 200,
 '002305_2014-06-28_19-56-50_260595134347_rgbf000102-resize_7': 203,
 '001447_2014-06-19_17-00-32_260595134347_rgbf000082-resize_5': 184,
 '001810_2014-06-26_20-51-35_260595134347_rgbf000040-resize_3': 270,
 '003069_2014-06-15_14-57-50_094959634447_rgbf000150-resize_4': 87,
 '002460_2014-06-28_20-35-43_260595134347_rgbf000028-resize_4': 391,
 '001516_2014-06-20_16-25-09_260595134347_rgbf000076-resize_2': 161,
 '002630_2014-06-24_14-47-50_094959634447_rgbf000055-resize_1': 62,
 '003083_2014-06-15_15-21-03_094959634447_rgbf000063-resize_1': 136,
 '000927_2014-06-09_16-32-30_260595134347_rgbf000123-resize_3': 115,
 '002057_2014-06-24_21-00-13_260595134347_rgbf000120-resize_1': 54,
 '003621_2014-05-23_18-06-08_094959634447_rgbf000101-resize_1': 84,
 '002323_2014-06-28_20-01-54_260595134347_rgbf000051-resize_4': 127,
 '003081_2014-06-15_15-19-16_094959634447_rgbf000150-resize_1': 170,
 '001056_2014-06-08_18-46-44_260595134347_rgbf000068-resize_0': 192,
 '001181_2014-06-17_15-50-57_260595134347_rgbf000106-resize_4': 79,
 '001199_2014-06-17_16-03-48_260595134347_rgbf000077-resize_0': 68,
 '001055_2014-06-08_18-45-35_260595134347_rgbf000111-resize_4': 51,
 '000740_2014-06-08_18-46-23_260595134347_rgbf000049-resize_6': 235,
 '000555_2014-06-09_22-42-23_260595134347_rgbf000037-resize_4': 335,
 '002790_2014-06-22_19-36-35_094959634447_rgbf000074-resize_4': 182,
 '003048_2014-06-15_13-49-43_094959634447_rgbf000150-resize_1': 120,
 '001132_2014-06-17_14-48-54_260595134347_rgbf000100-resize_2': 121,
 '002445_2014-06-28_20-32-16_260595134347_rgbf000029-resize_4': 321,
 '000493_2014-06-09_21-01-18_260595134347_rgbf000196-resize_3': 141,
 '002964_2014-06-08_17-46-11_094959634447_rgbf000091-resize_4': 407,
 '000736_2014-06-08_18-24-15_260595134347_rgbf000206-resize_3': 266,
 '001828_2014-06-26_21-40-03_260595134347_rgbf000024-resize_0': 106,
 '000483_2014-06-09_20-41-45_260595134347_rgbf000116-resize_4': 350,
 '002043_2014-06-24_20-29-38_260595134347_rgbf000039-resize_4': 119,
 '000542_2014-06-08_18-27-08_260595134347_rgbf000118-resize_1': 218,
 '001052_2014-06-08_18-24-54_260595134347_rgbf000130-resize_1': 58,
 '000780_2014-06-08_22-28-29_260595134347_rgbf000126-resize_1': 81,
 '000773_2014-06-08_22-24-54_260595134347_rgbf000093-resize_1': 141,
 '000868_2014-06-09_20-49-52_260595134347_rgbf000064-resize_4': 345,
 '003228_2014-05-14_13-42-35_094959634447_rgbf000101-resize_1': 304,
 '002467_2014-06-28_20-38-07_260595134347_rgbf000026-resize_2': 125,
 '001555_2014-06-20_17-12-10_260595134347_rgbf000065-resize_4': 390,
 '001011_2014-06-08_23-18-54_260595134347_rgbf000044-resize_4': 212,
 '000800_2014-06-08_22-42-09_260595134347_rgbf000095-resize_3': 132,
 '003490_2014-05-21_15-50-11_094959634447_rgbf000101-resize_3': 161,
 '002414_2014-06-28_20-24-58_260595134347_rgbf000067-resize_4': 174,
 '002509_2014-06-24_13-19-22_094959634447_rgbf000077-resize_0': 300,
 '003092_2014-06-24_21-01-49_094959634447_rgbf000049-resize_2': 277,
 '002568_2014-06-24_13-59-21_094959634447_rgbf000062-resize_4': 162,
 '002425_2014-06-28_20-27-29_260595134347_rgbf000031-resize_8': 99,
 '002600_2014-06-24_14-27-04_094959634447_rgbf000074-resize_2': 208,
 '001235_2014-06-17_16-37-36_260595134347_rgbf000084-resize_4': 150,
 '000739_2014-06-08_18-45-58_260595134347_rgbf000068-resize_1': 140,
 '002131_2014-06-25_21-12-01_260595134347_rgbf000083-resize_0': 50,
 '001618_2014-06-20_11-37-31_260595134347_rgbf000027-resize_3': 274,
 '001175_2014-06-17_15-45-55_260595134347_rgbf000129-resize_4': 65,
 '002375_2014-06-28_20-13-44_260595134347_rgbf000032-resize_1': 249,
 '000788_2014-06-08_22-34-36_260595134347_rgbf000131-resize_1': 228,
 '000409_2014-06-04_19-23-33_260595134347_rgbf000067-resize_0': 280,
 '000677_2014-06-08_23-10-32_260595134347_rgbf000158-resize_6': 196,
 '002279_2014-06-28_18-55-32_260595134347_rgbf000040-resize_5': 339,
 '002748_2014-06-22_19-07-22_094959634447_rgbf000078-resize_1': 54,
 '000735_2014-06-08_18-23-50_260595134347_rgbf000163-resize_2': 168,
 '002545_2014-06-24_13-38-53_094959634447_rgbf000080-resize_4': 137,
 '000753_2014-06-08_21-57-44_260595134347_rgbf000123-resize_3': 329,
 '002468_2014-06-28_20-38-39_260595134347_rgbf000045-resize_1': 76,
 '001289_2014-06-16_16-25-52_260595134347_rgbf000067-resize_1': 350,
 '001584_2014-06-20_11-07-43_260595134347_rgbf000002-resize_1': 62,
 '002750_2014-06-22_19-08-03_094959634447_rgbf000094-resize_4': 195,
 '000734_2014-06-08_17-39-11_260595134347_rgbf000128-resize_2': 64,
 '002805_2014-06-22_19-54-03_094959634447_rgbf000079-resize_1': 143,
 '000691_2014-06-08_13-08-50_260595134347_rgbf000132-resize_3': 249,
 '000906_2014-06-08_13-35-43_260595134347_rgbf000155-resize_1': 71,
 '001532_2014-06-20_16-50-41_260595134347_rgbf000081-resize_4': 428,
 '002763_2014-06-22_19-13-10_094959634447_rgbf000075-resize_4': 185,
 '001214_2014-06-17_16-13-55_260595134347_rgbf000111-resize_0': 272,
 '002758_2014-06-22_19-11-20_094959634447_rgbf000128-resize_1': 290,
 '002639_2014-06-24_14-51-37_094959634447_rgbf000074-resize_4': 140,
 '000869_2014-06-09_20-50-18_260595134347_rgbf000060-resize_3': 149,
 '003079_2014-06-15_15-18-20_094959634447_rgbf000152-resize_8': 64,
 '001222_2014-06-17_16-24-06_260595134347_rgbf000073-resize_0': 416,
 '000414_2014-06-04_19-49-13_260595134347_rgbf000044-resize_0': 68,
 '001264_2014-06-16_16-10-23_260595134347_rgbf000109-resize_1': 171,
 '002995_2014-06-15_12-31-26_094959634447_rgbf000150-resize_1': 116,
 '000447_2014-06-08_16-15-46_260595134347_rgbf000130-resize_1': 138,
 '001094_2014-06-15_17-36-00_260595134347_rgbf000205-resize_0': 82,
 '001808_2014-06-26_20-50-58_260595134347_rgbf000029-resize_1': 72,
 '000758_2014-06-08_22-05-08_260595134347_rgbf000085-resize_0': 122,
 '001571_2014-06-20_17-21-32_260595134347_rgbf000089-resize_1': 298,
 '000878_2014-06-08_22-52-45_260595134347_rgbf000045-resize_2': 97,
 '001167_2014-06-17_15-38-07_260595134347_rgbf000108-resize_0': 293,
 '002139_2014-06-25_21-19-37_260595134347_rgbf000124-resize_2': 114,
 '000636_2014-06-08_16-39-02_260595134347_rgbf000108-resize_4': 215}


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

  // $("#FinalInstructions").append(
  //   "<h1> Part 1 Task Instructions: </h1>"
  //   + "<p>A fixation cross will appear in the center of the screen - focus on this cross. The image will then appear for a brief amount of time, so make sure you are watching closely as to not miss the target. Then, the scene and target will disappear, and you will see an image of colored squares. Once this image disappears you will briefly see a fixation cross followed by another image of a scene for a brief amount of time. This will again be followed by an image of colored squares.</p>"
  //   + "<p>Then you will see a red fixation cross, indicating that you need to give your response. Respond which image's target was closer to you - Image 1 or Image 2? Press the 'z' key on your keyboard to indicate Image 1 or press the 'm' key on your keyboard to indicate Image 2. As soon as you respond, the fixation cross will turn black and the next trial will begin.</p>"
  //   + "<b>Please respond as quickly and accurately as possible!</b>"
  //   + "<p> You will complete 40 trials total.</p>"
  //   + "<p> The experiment will begin with 9 practice trials. During the practice portion you will receive feedback on each trial. The next trial will start momentarily after you see the feedback. If you are ready to begin, please click 'START PRACTICE' below. </p>"
  //   )

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
  $("#getConsent").hide();
  $("#Instructions2").hide();
  $("#FinalInstructions").hide();
  $("#getUnits").hide()

  $(".buttonDivPg2").hide();
  $(".buttonDivPg1").hide();
  $(".buttonDivPg3").hide();
  $(".buttonDivPg4").hide();

  if (practice_trial > 8){
    practiced = true 
    $("#start_trials").show()
    $(".startTrialsButtonDiv").show();
    $(".feedbackDiv").hide();

    
    // if (practice_acc < 7){
    //   if (secondPractice = true){
    //     practiced = true
    //   }
    //   else{
    //     practice_trial = 0
    //     secondPractice = true 
    //     $("#start_trials").show()
    //     $(".startTrialsButtonDiv").show();
    //     $(".feedbackDiv").hide();

    //   }
 
    // }
    // else{
    //   practiced = true 
    //   $("#start_trials").show()
    //   $(".startTrialsButtonDiv").show();
    //   $(".feedbackDiv").hide();

    // }
  }
    

  else{
    scene_duration = getTrialDuration();
    var fixation = showFixation();
    // Timing note: time accumulates so it is not actual duration but relative time
    // have to account for the time already spent
    var green_fixation = setTimeout(function(){showGreenFixation();}, fixation_time);
    var scene1 = setTimeout(function(){showScene1();}, fixation_time + fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask1();}, fixation_time + fixation_time + scene_duration); 
    var fixation2 = setTimeout(function(){showFixation();}, fixation_time + fixation_time + scene_duration + mask_time); 
    var scene2 = setTimeout(function(){showScene2();}, fixation_time + fixation_time + scene_duration + mask_time + fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask2 = setTimeout(function(){showMask2();}, fixation_time + fixation_time + scene_duration + mask_time + fixation_time + scene_duration); 
    var response = setTimeout(function(){getResponse();detectKeyPress();}, fixation_time + fixation_time + scene_duration + mask_time + fixation_time + scene_duration + mask_time)
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
    var green_fixation = setTimeout(function(){showGreenFixation();}, fixation_time);
    var scene1 = setTimeout(function(){showScene1();}, fixation_time + fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask = setTimeout(function(){showMask1();}, fixation_time + fixation_time + scene_duration); 
    var fixation2 = setTimeout(function(){showFixation();}, fixation_time + fixation_time + scene_duration + mask_time); 
    var scene2 = setTimeout(function(){showScene2();}, fixation_time + fixation_time + scene_duration + mask_time + fixation_time); // the time here is how long it takes to show up NOT time on the screen
    var mask2 = setTimeout(function(){showMask2();}, fixation_time + fixation_time + scene_duration + mask_time + fixation_time + scene_duration); 
    var response = setTimeout(function(){getResponse();detectKeyPress();}, fixation_time + fixation_time + scene_duration + mask_time + fixation_time + scene_duration + mask_time)
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
    $(".green_fixationDiv").hide();
  })

}

function showGreenFixation(){
  gf_path = "green_fixation.jpg"
  $("#green_fixation_image").attr("src", gf_path)

  $(document).ready(function(){
    $(".green_fixationDiv").show();
    $(".fixationDiv").hide();
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

    var s_path_0_split = s_path_0.split("/")
    var folder = s_path_0_split[s_path_0_split.length - 2]
    var ypos = practice_positions[folder] 

    $("#scene_image").attr("src", s_path_0);
    var doc_height = $(document).height()
    console.log(ypos, 'ypos', folder)
    if (ypos >= (530/2)){
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)
    }
    else{ 
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)

    }
    var num_string = top_px.toString();
    var pos = document.getElementById("scene");
    pos.style.top = num_string + 'px'

  }
  else{ 
    startTrialTime = new Date; // time at which the scene is presented for a given trial 

    var s_path_0 = stim_seq[trial].image_path_target_0
    var s_duration = stim_seq[trial].duration 
    var actual_depth_0 = stim_seq[trial].depth_0



    var s_path_0_split = s_path_0.split("/")
    var folder = s_path_0_split[s_path_0_split.length - 2]
    var ypos = positions[folder] 

    $("#scene_image").attr("src", s_path_0);
    var doc_height = $(document).height()
    console.log(ypos, 'ypos', folder)
    if (ypos >= (530/2)){
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)
    }
    else{ 
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)

    }
    var num_string = top_px.toString();
    var pos = document.getElementById("scene");
    pos.style.top = num_string + 'px'
  }

  startSceneTimeLog1 = new Date; // time at which scene is presented 
  $("#scene_image").attr("src", s_path_0);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".maskDiv").hide();
    $(".sceneDiv").show();
    $(".feedbackDiv").hide();
    $(".green_fixationDiv").hide();
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

    var s_path_1_split = s_path_1.split("/")
    var folder = s_path_1_split[s_path_1_split.length - 2]
    var ypos = practice_positions[folder] 

    $("#scene_image").attr("src", s_path_1);
    var doc_height = $(document).height()
    console.log(ypos, 'ypos', folder)
    if (ypos >= (530/2)){
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)
    }
    else{ 
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)

    }
    var num_string = top_px.toString();
    var pos = document.getElementById("scene");
    pos.style.top = num_string + 'px'

  }
  else{ 
    // startTrialTime = new Date; // time at which the scene is presented for a given trial 

    var s_path_1 = stim_seq[trial].image_path_target_1
    var s_duration = stim_seq[trial].duration 
    var actual_depth_1 = stim_seq[trial].depth_1

    var s_path_1_split = s_path_1.split("/")
    var folder = s_path_1_split[s_path_1_split.length - 2]
    var ypos = positions[folder] 

    $("#scene_image").attr("src", s_path_1);
    var doc_height = $(document).height()
    console.log(ypos, 'ypos', folder)
    if (ypos >= (530/2)){
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)
    }
    else{ 
      var top_px = (doc_height/2 - 530/2) + (530/2 - ypos)

    }
    var num_string = top_px.toString();
    var pos = document.getElementById("scene");
    pos.style.top = num_string + 'px'
  }

  startSceneTimeLog2 = new Date; // time at which scene is presented 
  $("#scene_image").attr("src", s_path_1);
  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".maskDiv").hide();
    $(".sceneDiv").show();
    $(".feedbackDiv").hide();
    $(".green_fixationDiv").hide();
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
    $(".green_fixationDiv").hide();
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
    $(".green_fixationDiv").hide();
  })

}

// https://www.w3schools.com/js/js_validation.asp
// depth estimate is validated in html response div

function getResponse(){
  endMaskTimeLog2 = new Date;
  log_mask2 = endMaskTimeLog2 - startMaskTimeLog2;

  // red_f_path = "red_fixation.jpg"
  red_f_path = "red_fixation_instruction.jpg"
  $("#red_fixation_image").attr("src", red_f_path)

  $(document).ready(function(){
    $(".fixationDiv").hide();
    $(".sceneDiv").hide();
    $(".maskDiv").hide();
    $(".feedbackDiv").hide();
    $(".responseDiv").show();
    $(".green_fixationDiv").hide();

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
        var next = setTimeout(function(){nextTrial();}, 2200); // the time here is how long it takes to show up NOT time on the screen

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
        var next = setTimeout(function(){nextTrial();}, 2200); // the time here is how long it takes to show up NOT time on the screen

      }
      else{
        nextTrial(); //since button was pressed, move onto next trial
      }
    }

    if (event.key == ' '){ 
      key = "spacebar";
      discrim_choice = 3; // indicates that stim1 and stim2 are the same image 
      endTrialTime = new Date; // time at which response has been given for past trial
        RT = endTrialTime - startTrialTime;

      if (practiced == false) {
        var feedback = showFeedback();
        var next = setTimeout(function(){nextTrial();}, 2200); // the time here is how long it takes to show up NOT time on the screen

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
        var next = setTimeout(function(){nextTrial();}, 2200); // the time here is how long it takes to show up NOT time on the screen

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
    $(".green_fixationDiv").hide();

  })

  var correct_answers = [0,1,1,0,0,1,1,0,0]
  var trial_answer = correct_answers[practice_trial]

  if (discrim_choice == trial_answer){
      $("#feedback").empty().append("<b>Correct!</b>");
      // $("#feedback").append("<p>Correct!</p>");
      practice_performance.push('0');  // correct answer was given
      practice_acc += 1

  }
  else{
    practice_performance.push('1'); // incorrect answer was given
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
    $(".green_fixationDiv").hide();
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
  thisData["versionName"].push("v2_duration_discrimination");
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


  thisData['practice_performance_0'] = Array(trial).fill(practice_performance[0]);
  thisData['practice_performance_1'] = Array(trial).fill(practice_performance[1]);
  thisData['practice_performance_2'] = Array(trial).fill(practice_performance[2]);
  thisData['practice_performance_3'] = Array(trial).fill(practice_performance[3]);
  thisData['practice_performance_4'] = Array(trial).fill(practice_performance[4]);
  thisData['practice_performance_5'] = Array(trial).fill(practice_performance[5]);
  thisData['practice_performance_6'] = Array(trial).fill(practice_performance[6]);
  thisData['practice_performance_7'] = Array(trial).fill(practice_performance[7]);
  thisData['practice_performance_8'] = Array(trial).fill(practice_performance[8]);


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