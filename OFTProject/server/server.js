var loopback = require('loopback');
var boot = require('loopback-boot');
var bodyParser = require('body-parser');
var session = require('express-session');
var fileUpload = require('express-fileupload');
var fs = require('fs');
var xlstojson = require("xls-to-json-lc");
var xlsxtojson = require("xlsx-to-json-lc");
var express = require('express');
var fs = require('fs');
const { log } = require('console');
var app = express();
app = module.exports = loopback();
// parse application/json
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({
	extended: true
}));
app.use(session({
	secret: 'anubhavApp'
}));
app.use(fileUpload());
app.start = function () {
	// start the web server
	return app.listen(function () {
		app.emit('started');
		var baseUrl = app.get('url').replace(/\/$/, '');
		console.log('Web server listening at: %s', baseUrl);
		if (app.get('loopback-component-explorer')) {
			var explorerPath = app.get('loopback-component-explorer').mountPath;
			console.log('Browse your REST API at %s%s', baseUrl, explorerPath);
		}

		var Server = app.models.Server;
		var ServerPay = app.models.ServerPay;

		app.get('/ServerDownload', function (req, res) {

			Server.find({})
				.then(function (Records, err) {
					if (Records) {

						var excel = require('exceljs');
						var workbook = new excel.Workbook(); //creating workbook
						var sheet = workbook.addWorksheet('MySheet'); //creating worksheet

						sheet.addRow().values = Object.keys(Records[0].__data);

						for (var i = 0; i < Records["length"]; i++) {
							sheet.addRow().values = Object.values(Records[i].__data);
						}

						var tempfile = require('tempfile');
						var tempFilePath = tempfile('.xlsx');
						console.log("tempFilePath : ", tempFilePath);
						workbook.xlsx.writeFile(tempFilePath).then(function () {
							res.sendFile(tempFilePath, function (err) {
								if (err) {
									console.log('---------- error downloading file: ', err);
								}
							});
							console.log('file is written @ ' + tempFilePath);
						});

					}
				}

				);
		});


		app.post('/getWorkAggregate', function (req, res) {
			var responseData = [];
			var app = require('../server/server');
			var currentDate = req.body.currentDate;
			var userId = req.body.userId;

			//
			var Task = app.models.task;

			function getMonths() {
				var iCount = 4;
				var aMonths = [];

				while (iCount > -1) {
					var oDate = new Date();
					oDate.setMonth(oDate.getMonth() - iCount);
					var oStartDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
					var oEndDate = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);

					aMonths.push({
						StartDate: oStartDate,
						EndDate: oEndDate
					})

					iCount = iCount - 1;
				}

				return aMonths;
			}

			var aMonths = getMonths();
			var oPeriodStartDate = aMonths[4].StartDate;
			var oPeriodEnddate = aMonths[0].EndDate;


			var date = new Date();
			date.setDate(1);

			Task.find({
				where: {
					and: [
						{ CreatedBy: userId },
						{
							CreatedOn: {
								gte: date
							}
						}
					]
				}
			}).then(function (data) {
				
				var tempRep = [];
				for (var i = 0; i < data.length; i++) {
					var record = data[i];
					if (tempRep[record.taskType]) {
						tempRep[record.taskType].hourWorked =
							parseInt(record.noOfHours) +
							tempRep[record.taskType].hourWorked;
					} else {
						tempRep[record.taskType] = {
							taskType: record.taskType,
							hourWorked: parseInt(record.noOfHours)
						};
					}
				}
				// var aStudents = [];
				// for (var j = 0; j < aMonths.length; j++) {
				//
				// 	aStudents = data.filter(function(oRec) {
				// 		return oRec.CreatedOn >= aMonths[j].StartDate && oRec.CreatedOn <= aMonths[j].EndDate
				// 	})
				//
				// 	responseData.push({
				// 		Month: aMonths[j].StartDate.getMonthText(),
				// 		Count: aStudents.length
				// 	})
				//
				// }
				for (item in tempRep) {
					responseData.push(tempRep[item]);
				}
				// responseData = [{
				// 	taskType: "GB",
				// 	hourWorked: 10
				// },
				// {
				// 	taskType: "FP",
				// 	hourWorked: 3
				// },
				// {
				// 	taskType: "LP",
				// 	hourWorked: 4
				// },
				// {
				// 	taskType: "PT",
				// 	hourWorked: 8
				// }];
				res.send(responseData);

			})

		});

		app.get('/ServerDownloadAct', function (req, res) {
			var date = new Date();
			Server.find({
				where: {
					and: [{
						EndDate: {
							gt: date
						}
					}, {
						UserEndDate: {
							gt: date
						}
					}]
				}
			})
				.then(function (Records, err) {
					if (Records) {

						var excel = require('exceljs');
						var workbook = new excel.Workbook(); //creating workbook
						var sheet = workbook.addWorksheet('MySheet'); //creating worksheet

						sheet.addRow().values = Object.keys(Records[0].__data);

						for (var i = 0; i < Records["length"]; i++) {
							sheet.addRow().values = Object.values(Records[i].__data);
						}

						var tempfile = require('tempfile');
						var tempFilePath = tempfile('.xlsx');
						console.log("tempFilePath : ", tempFilePath);
						workbook.xlsx.writeFile(tempFilePath).then(function () {
							res.sendFile(tempFilePath, function (err) {
								if (err) {
									console.log('---------- error downloading file: ', err);
								}
							});
							console.log('file is written @ ' + tempFilePath);
						});

					}
				}

				);
		});

		app.get('/ServerDownloadInAct', function (req, res) {

			var date = new Date();
			Server.find({
				where: {
					and: [{
						EndDate: {
							gt: date
						}
					}, {
						UserEndDate: {
							lt: date
						}
					}]
				}
			})
				.then(function (Records, err) {
					if (Records) {

						var excel = require('exceljs');
						var workbook = new excel.Workbook(); //creating workbook
						var sheet = workbook.addWorksheet('MySheet'); //creating worksheet

						sheet.addRow().values = Object.keys(Records[0].__data);

						for (var i = 0; i < Records["length"]; i++) {
							sheet.addRow().values = Object.values(Records[i].__data);
						}

						var tempfile = require('tempfile');
						var tempFilePath = tempfile('.xlsx');
						console.log("tempFilePath : ", tempFilePath);
						workbook.xlsx.writeFile(tempFilePath).then(function () {
							res.sendFile(tempFilePath, function (err) {
								if (err) {
									console.log('---------- error downloading file: ', err);
								}
							});
							console.log('file is written @ ' + tempFilePath);
						});

					}
				}

				);
		});

		app.get('/getStudentPerBatch', function (req, res) {
			var responseData = [];
			var app = require('../server/server');
			var Sub = app.models.Sub;
			var Courses = app.models.Course;
			var aCourses = [];
			// step 1: get all the batches which are marked for analysis analysis=true
			// Courses.find({where: { analysis=true}}).then(function(data){
			Courses.find().then(function (data) {
				// console.log("Test Course")
				aCourses = data;
				// dynamic where
				var aOrCond = []
				for (var i = 0; i < data.length; i++) {
					// var oCourse = {};
					var oCond = {}
					oCond.eq = data[i].id;
					aOrCond.push({
						CourseId: oCond
					});
				}
				// Sub.find({where : dynamic where}).then(function(data){
				Sub.find({
					where: {
						or: aOrCond
					}
				}).then(function (data) {
					ObjectId = require('mongodb').ObjectID;
					var oSubCounter = {};
					data.forEach(function (obj) {
						var key = obj.CourseId;
						oSubCounter[key] = (oSubCounter[key] || 0) + 1
					})

					var responseData = [];
					Object.keys(oSubCounter).forEach(function (key) {
						var oObjId = ObjectId(key);
						// console.log(key, oSubCounter[key]);
						var oRecFil = aCourses.filter(function (oRecord) {
							return oRecord.id.toString() === oObjId.toString();
						});

						if (oRecFil.length > 0) {
							responseData.push({
								"BatchName": oRecFil[0].BatchNo,
								"Count": oSubCounter[key]
							})
						}
					});

					//--- Calculate total per batch, prepare json and return
					res.send(responseData);
				})
			});

		});

		app.post('/getLeaveValidator', function (req, res) {
			
			var date = req.body.date;
			var selectedDay = new Date(date).getDate();
			var selectedMonth = new Date(date).getMonth();
			var selectedYear = new Date(date).getFullYear();
			var tdate = new Date();
			this.empId = req.body.EmpId;
			var oStartDate = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), 1);
			var oEndDate = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0);
			var LeaveRequest = app.models.LeaveRequest;
			var Holidays = app.models.HolidayCalendar;
			var AppUser = app.models.AppUser;
			var flag = 0;
			var oLeaveRecords = [];
			LeaveRequest.find({
				where:
				{
					and: [
						{ DateFrom: { between: [oStartDate, oEndDate] } },
						{ AppUserId: this.empId }
					]
				},
				order: 'DateFrom ASC'
			}).then(function (leaveRecords) {
				//	var that3 = that2;
				//		this.leaveRecords = leaveRecords;
				var flag = 0;
				if (leaveRecords.length) {
					for (var i = 0; i < leaveRecords.length; i++) {
						oLeaveRecords[i] = leaveRecords[i];
					}
				}

				Holidays.find(
					{ where: { Date: { between: [oStartDate, oEndDate] } }, order: 'Date ASC' }
				).then(function (holidayRecords) {
					var tDate = new Date();
					var holidayLeaveCal = [];
					var noOfDaysInMonth = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate();
					//this loop will interate for 12 time month wise
					// 				for (var i = 0; i < 12; i++) {
					// 		//this loop will iterate each month Day wise
					// 		var fDate = new Date(tDate.getFullYear(),i,1);
					// 		 			for (var j = 0; j <  new Date(fDate.getFullYear(),fDate.getMonth()+1,0).getDate(); j++) {
					// 						var monthDate = new Date(fDate.getFullYear(),fDate.getMonth(),j+1);
					// 						var flag = 0;
					// 						for (var k = 0; k < holidayRecords.length; k++) {
					// 									var oDate =  holidayRecords[k].__data.Date;
					// 						if ((new Date(monthDate).getDate() == new Date(oDate).getDate()) && (new Date(monthDate).getMonth() == new Date(oDate).getMonth()) && (new Date(monthDate).getFullYear() == new Date(oDate).getFullYear() ) ){
					// 								flag = 1;
					// 								holidayLeaveCal.push({
					// 								Day:holidayRecords[k].__data.Day,
					// 								Date:holidayRecords[k].__data.Date,
					// 								Occasion:holidayRecords[k].__data.Occasion,
					// 								Mark:'PH',
					// 								Available:'NA',
					// 								LeaveType:'',
					// 								LeaveStatus:'',
					// 								Holiday:''
					// 							});
					// 							break;
					// 						}
					// 					}
					// 					if (flag == 0) {
					// 						holidayLeaveCal.push({
					// 						Day:new Date(fDate.getFullYear(),fDate.getMonth(),j+1).getDay(),
					// 						Date: new Date(fDate.getFullYear(),fDate.getMonth(),j+1),
					// 						Occasion:'',
					// 						Mark:'',
					// 						Available:'',
					// 						LeaveType:'',
					// 						LeaveStatus:'',
					// 						Holiday:''
					// 					});
					// 		}
					//
					// 	}
					// }
					for (var j = 0; j < noOfDaysInMonth; j++) {
						var monthDate = new Date(new Date(date).getFullYear(), new Date(date).getMonth(), j + 1);
						var flag = 0;
						if (holidayRecords.length) {
							for (var k = 0; k < holidayRecords.length; k++) {
								var oDate = holidayRecords[k].__data.Date;
								if ((new Date(monthDate).getDate() == new Date(oDate).getDate()) && (new Date(monthDate).getMonth() == new Date(oDate).getMonth()) && (new Date(monthDate).getFullYear() == new Date(oDate).getFullYear())) {
									flag = 1;
									holidayLeaveCal.push({
										Day: holidayRecords[k].__data.Day,
										Date: holidayRecords[k].__data.Date,
										Occasion: holidayRecords[k].__data.Occasion,
										Mark: 'PH',
										Available: 'NA',
										LeaveType: '',
										LeaveStatus: '',
										Holiday: ''
									});
									break;
								}
							}
						}
						if (flag == 0) {
							holidayLeaveCal.push({
								Day: new Date(monthDate.getFullYear(), monthDate.getMonth(), j + 1).getDay(),
								Date: new Date(monthDate.getFullYear(), monthDate.getMonth(), j + 1),
								Occasion: '',
								Mark: '',
								Available: '',
								LeaveType: '',
								LeaveStatus: '',
								Holiday: ''
							});
						}

					}

					
					//	var holidayCal = [];
					for (var l = 0; l < holidayLeaveCal.length; l++) {
						var oDate = holidayLeaveCal[l].Date;
						var flag = 0;
						if (oLeaveRecords.length) {
							for (var i = 0; i < oLeaveRecords.length; i++) {
								var dFrom = oLeaveRecords[i].__data.DateFrom;
								var nDays = oLeaveRecords[i].__data.Days;

								if ((new Date(dFrom).getDate() == new Date(oDate).getDate()) && (new Date(dFrom).getMonth() == new Date(oDate).getMonth()) && (new Date(dFrom).getFullYear() == new Date(oDate).getFullYear())) {
									if (flag == 0) {
										for (var j = 0; j < nDays; j++) {
											flag = 1;
											if (holidayLeaveCal[l].Mark == 'PH') {
												holidayLeaveCal[l].Mark = 'PH';
												holidayLeaveCal[l].Available = 'NA';
												holidayLeaveCal[l].LeaveType = oLeaveRecords[i].__data.LeaveType;
												holidayLeaveCal[l].LeaveStatus = oLeaveRecords[i].__data.Status;
												j--;

											} else {
												holidayLeaveCal[l].Mark = 'LEAVE';
												holidayLeaveCal[l].Available = 'NA';
												holidayLeaveCal[l].LeaveType = oLeaveRecords[i].__data.LeaveType;
												holidayLeaveCal[l].LeaveStatus = oLeaveRecords[i].__data.Status;
											}
											l++;
										}

									} else {
										break;
									}

								}
							}
						}
					}

					AppUser.find().then(function (empRecords) {
						for (var i = 0; i < empRecords.length; i++) {
							if (this.empId === empRecords[i].TechnicalId) {
								var empRecord = empRecords[i];
								break;
							}
						}
						//this for loop will assign the Holiday assigned for this User
						for (var i = 0; i < holidayLeaveCal.length; i++) {
							if (empRecord.__data.Holiday === "Sunday") {
								if (holidayLeaveCal[i].Date.getDay() === 0) {
									holidayLeaveCal[i].Holiday = 'Holiday';
								}
							} else if (empRecord.__data.Holiday === "Monday") {
								if (holidayLeaveCal[i].Date.getDay() === 1) {
									holidayLeaveCal[i].Holiday = 'Holiday';
								}
							} else if (empRecord.__data.Holiday === "Tuesday") {
								if (holidayLeaveCal[i].Date.getDay() === 2) {
									holidayLeaveCal[i].Holiday = 'Holiday';
								}
							} else if (empRecord.__data.Holiday === "Wednesday") {
								if (holidayLeaveCal[i].Date.getDay() === 3) {
									holidayLeaveCal[i].Holiday = 'Holiday';
								}
							} else if (empRecord.__data.Holiday === "Thursday") {
								if (holidayLeaveCal[i].Date.getDay() === 4) {
									holidayLeaveCal[i].Holiday = 'Holiday';
								}
							} else if (empRecord.__data.Holiday === "Friday") {
								if (holidayLeaveCal[i].Date.getDay() === 5) {
									holidayLeaveCal[i].Holiday = 'Holiday';
								}
							} else if (empRecord.__data.Holiday === "Saturday") {
								if (holidayLeaveCal[i].Date.getDay() === 6) {
									holidayLeaveCal[i].Holiday = 'Holiday';
								}
							}
						}
						res.send(holidayLeaveCal);
					});

				});


			});

		});

		app.post('/getTimeTracker', function (req, res) {
			var month = req.body.Month;
			this.empId = req.body.EmpId;
			var today = new Date();

			


			var oArrTime = [];

			if ((new Date(month).getMonth() === new Date(today).getMonth()) && (new Date(month).getFullYear() === new Date(today).getFullYear())) {
				var monthStart = new Date(new Date(month).getFullYear(), new Date(month).getMonth(), 1);
				var dayEnd = new Date();

				monthStart.setMilliseconds(0);
				monthStart.setSeconds(0);
				monthStart.setMinutes(0);
				monthStart.setHours(0);

				dayEnd.setMilliseconds(0);
				dayEnd.setSeconds(59);
				dayEnd.setMinutes(59);
				dayEnd.setHours(23);

				var app = require('../server/server');
				var AppUser = app.models.AppUser;
				var LeaveRequest = app.models.LeaveRequest;
				var Holidays = app.models.HolidayCalendar;
				var taskTab = app.models.task;

				//Step 1: Read all employee data for given employee - JoiningDate, When is holiday, What leaveRequest
				//AppUser, leaveRequest, task
				//anubhav is here
				var that = this;

				AppUser.find().then(function (empRecords) {
					for (var i = 0; i < empRecords.length; i++) {
						if (that.empId === empRecords[i].TechnicalId) {
							var empRecord = empRecords[i];
							break;
						}
					}
					var that2 = that;
					that2.empRecord = empRecord;
					//var joiningDate = empRecord.JoiningDate;
					var holiday = empRecord.Holiday;
					LeaveRequest.find({
						where:
						{
							and: [
								{ DateFrom: { between: [monthStart, dayEnd] } },
								{ AppUserId: that2.empId }
							]
						},
						order: 'DateFrom ASC'
					}).then(function (leaveRecords) {
						var that3 = that2;
						that3.leaveRecords = leaveRecords;
						that4 = that3;
						taskTab.find({
							where:
							{
								and: [
									{ CrDate: { between: [monthStart, dayEnd] } },
									{ CreatedBy: that4.empId }
								]
							},
							order: 'CrDate ASC'
						}).then(function (tasks) {
							// /empRecord
							// leaveRecords
							// tasks
							//step 2: calculate and prepare a final table with below structure
							//Date and Hour
							//01.01.2019  8 , 02.01 6 , 03.01 Holiday, 04.01 LEAVE, 05.01 0, 06.01 7


							//This For Loop is to calculate the No of hours for each day in a month
							var noOfDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
							if (tasks.length) {

								for (var i = 0; i < noOfDays; i++) {
									var start = new Date(new Date(month).getFullYear(), new Date(month).getMonth(), i + 1);
									var flag = 0;
									var nHr = 0;
									for (var j = 0; j < tasks.length; j++) {
										var crdate = tasks[j].__data.CrDate;

										if (start.getDate() === crdate.getDate()) {
											flag = 1;
											var nHr = nHr + parseFloat(tasks[j].__data.noOfHours.valueOf());
										}

									}
									if (flag === 0) {
										var h = 0;
										oArrTime.push({ date: start, hours: h, LeaveType: "" });
									} else {
										oArrTime.push({ date: start, hours: nHr, LeaveType: "" });
									}


								}
								//this for loop is to calculate the Leaves taken by employee in a given month
								for (var i = 0; i < oArrTime.length; i++) {
									var date = oArrTime[i].date.getDate();
									var flag = 0;

									for (var j = 0; j < leaveRecords.length; j++) {
										var dFrom = leaveRecords[j].__data.DateFrom;
										var dTo = leaveRecords[j].__data.DateTo;
										var dDiff = (dTo - dFrom) / (1000 * 3600 * 24) + 1;
										if (date === leaveRecords[j].__data.DateFrom.getDate()) {
											if (flag === 0) {
												for (var k = 0; k < dDiff; k++) {
													flag = 1;
													oArrTime[i].hours = 'LEAVE';
													oArrTime[i].LeaveType = leaveRecords[j].__data.LeaveType;
													i++;
												}
												//	i = leaveRecords[j].__data.Days - 1;
											} else {
												break;
											}
										}

									}
								}
								//this for loop is to find and assign Holiday for employee for given month
								for (var i = 0; i < oArrTime.length; i++) {
									if (empRecord.__data.Holiday === "Sunday") {
										if (oArrTime[i].date.getDay() === 0) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Monday") {
										if (oArrTime[i].date.getDay() === 1) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Tuesday") {
										if (oArrTime[i].date.getDay() === 2) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Wednesday") {
										if (oArrTime[i].date.getDay() === 3) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Thursday") {
										if (oArrTime[i].date.getDay() === 4) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Friday") {
										if (oArrTime[i].date.getDay() === 5) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Saturday") {
										if (oArrTime[i].date.getDay() === 6) {
											oArrTime[i].hours = 'Holiday';
										}
									}
								}
								// console.log(that3.empRecord);
								// console.log(that3.leaveRecords);
								//
								var timeTrackerCalendar = [];
								var oStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
								var oEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
								Holidays.find(
									{ where: { Date: { between: [oStartDate, oEndDate] } }, order: 'Date ASC' }
								).then(function (holidayRecords) {
									var tDate = new Date();
									var noOfDaysInMonth = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate();

									for (var i = 0; i < oArrTime.length; i++) {
										var date = oArrTime[i].date;
										var flag = 0;
										for (var j = 0; j < holidayRecords.length; j++) {
											var hDate = holidayRecords[j].__data.Date;
											if (date.getDate() == hDate.getDate()) {
												flag = 1;
												timeTrackerCalendar.push({
													Day: holidayRecords[j].__data.Day,
													Occasion: holidayRecords[j].__data.Occasion,
													remark: "PH",
													hours: oArrTime[j].hours,
													Date: oArrTime[j].date,
													LeaveType: oArrTime[j].LeaveType
												});
											}
										}
										if (flag == 0) {
											timeTrackerCalendar.push({
												Day: "",
												Occasion: "",
												remark: "",
												hours: oArrTime[i].hours,
												Date: oArrTime[i].date,
												LeaveType: oArrTime[i].LeaveType
											});
										}

									}
									res.send(timeTrackerCalendar);

								});


							} else {
								// console.log("There is no data available the selected month ");
								// res.send(oArrTime);
								var oArrTime1 = [];
								var noOfDays = new Date(today.getFullYear(), today.getMonth() + 1, 0).getDate();
								var h = 0;
								for (var i = 0; i < noOfDays; i++) {
									var start = new Date(new Date(month).getFullYear(), new Date(month).getMonth(), i + 1);

									oArrTime1.push({ date: start, hours: h, LeaveType: "" });

								}
								//this for loop is to calculate the Leaves taken by employee in a given month
								if (leaveRecords) {

									for (var i = 0; i < oArrTime1.length; i++) {
										var date = oArrTime1[i].date.getDate();
										var flag = 0;
										for (var j = 0; j < leaveRecords.length; j++) {
											var dFrom = leaveRecords[j].__data.DateFrom;
											var dTo = leaveRecords[j].__data.DateTo;
											var dDiff = (dTo - dFrom) / (1000 * 3600 * 24) + 1;
											if (date === leaveRecords[j].__data.DateFrom.getDate()) {
												if (flag === 0) {
													for (var k = 0; k < dDiff; k++) {
														flag = 1;
														oArrTime1[i].hours = 'LEAVE';
														oArrTime1[i].LeaveType = leaveRecords[j].__data.LeaveType;
														i++;
													}
													//	i = leaveRecords[j].__data.Days - 1;
												} else {
													break;
												}
											}

										}
									}

								}

								//this for loop is to find and assign Holiday for employee for given month
								for (var i = 0; i < oArrTime1.length; i++) {
									if (empRecord.__data.Holiday === "Sunday") {
										if (oArrTime1[i].date.getDay() === 0) {
											oArrTime1[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Monday") {
										if (oArrTime1[i].date.getDay() === 1) {
											oArrTime1[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Tuesday") {
										if (oArrTime1[i].date.getDay() === 2) {
											oArrTime1[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Wednesday") {
										if (oArrTime1[i].date.getDay() === 3) {
											oArrTime1[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Thursday") {
										if (oArrTime1[i].date.getDay() === 4) {
											oArrTime1[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Friday") {
										if (oArrTime1[i].date.getDay() === 5) {
											oArrTime1[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Saturday") {
										if (oArrTime1[i].date.getDay() === 6) {
											oArrTime1[i].hours = 'Holiday';
										}
									}
								}
								// console.log(that3.empRecord);
								// console.log(that3.leaveRecords);
								//
								var timeTrackerCalendar = [];
								var oStartDate = new Date(today.getFullYear(), today.getMonth(), 1);
								var oEndDate = new Date(today.getFullYear(), today.getMonth() + 1, 0);
								Holidays.find(
									{ where: { Date: { between: [oStartDate, oEndDate] } }, order: 'Date ASC' }
								).then(function (holidayRecords) {
									var tDate = new Date();
									var noOfDaysInMonth = new Date(new Date(date).getFullYear(), new Date(date).getMonth() + 1, 0).getDate();

									for (var i = 0; i < oArrTime1.length; i++) {
										var date = oArrTime1[i].date;
										var flag = 0;
										for (var j = 0; j < holidayRecords.length; j++) {
											var hDate = holidayRecords[j].__data.Date;
											if (date.getDate() == hDate.getDate()) {
												flag = 1;
												timeTrackerCalendar.push({
													Day: holidayRecords[j].__data.Day,
													Occasion: holidayRecords[j].__data.Occasion,
													remark: "PH",
													hours: oArrTime1[j].hours,
													Date: oArrTime1[j].date,
													LeaveType: oArrTime1[j].LeaveType
												});
											}
										}
										if (flag == 0) {
											timeTrackerCalendar.push({
												Day: "",
												Occasion: "",
												remark: "",
												hours: oArrTime1[i].hours,
												Date: oArrTime1[i].date,
												LeaveType: oArrTime1[i].LeaveType
											});
										}

									}
									res.send(timeTrackerCalendar);

								});

							}

						});

					});

				});



			} else if (new Date(month) > new Date(today)) {

				console.log("There is no data available the selected month ");
				res.send(oArrTime);
			}
			else {

				var startDateCurrent = new Date(new Date(month).getFullYear(), new Date(month).getMonth(), 1);
				var noOfDays = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0).getDate();
				endDateCurrent = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0);

				startDateCurrent.setMilliseconds(0);
				startDateCurrent.setSeconds(0);
				startDateCurrent.setMinutes(0);
				startDateCurrent.setHours(0);

				endDateCurrent.setMilliseconds(0);
				endDateCurrent.setSeconds(59);
				endDateCurrent.setMinutes(59);
				endDateCurrent.setHours(23);

				var app = require('../server/server');
				var AppUser = app.models.AppUser;
				var LeaveRequest = app.models.LeaveRequest;
				var taskTab = app.models.task;
				var Holidays = app.models.HolidayCalendar;
				//Step 1: Read all employee data for given employee - JoiningDate, When is holiday, What leaveRequest
				//AppUser, leaveRequest, task
				//anubhav is here
				var that = this;
				AppUser.find().then(function (empRecords) {
					for (var i = 0; i < empRecords.length; i++) {
						if (that.empId === empRecords[i].TechnicalId) {
							var empRecord = empRecords[i];
							break;
						}
					}
					var that2 = that;
					that2.empRecord = empRecord;
					var joiningDate = empRecord.JoiningDate;
					var holiday = empRecord.Holiday;
					LeaveRequest.find({
						where:
						{
							and: [
								{ DateFrom: { between: [startDateCurrent, endDateCurrent] } },
								{ AppUserId: that2.empId }
							]
						},
						order: 'DateFrom ASC'
					}).then(function (leaveRecords) {
						var that3 = that2;
						that3.leaveRecords = leaveRecords;
						that4 = that3;
						taskTab.find({
							where:
							{
								and: [
									{ CrDate: { between: [startDateCurrent, endDateCurrent] } },
									{ CreatedBy: that4.empId }
								]
							},
							order: 'CrDate ASC'
						}).then(function (tasks) {
							// /empRecord
							// leaveRecords
							// tasks
							//step 2: calculate and prepare a final table with below structure
							//Date and Hour
							//01.01.2019  8 , 02.01 6 , 03.01 Holiday, 04.01 LEAVE, 05.01 0, 06.01 7

							if (tasks.length) {


								//This For Loop is to calculate the No of hours for each day in a month
								for (var i = 0; i < noOfDays; i++) {
									var start = new Date(new Date(month).getFullYear(), new Date(month).getMonth(), i + 1);
									var flag = 0;
									var nHr = 0;
									for (var j = 0; j < tasks.length; j++) {
										var crdate = tasks[j].__data.CrDate;
										if (start.getDate() === crdate.getDate()) {
											flag = 1;
											var nHr = nHr + parseInt(tasks[j].__data.noOfHours.valueOf());
										}
									}
									if (flag === 0) {
										var h = 0;
										oArrTime.push({ date: start, hours: h, LeaveType: "" });
									} else {
										oArrTime.push({ date: start, hours: nHr, LeaveType: "" });
									}

								}


								//this for loop is to calculate the Leaves taken by employee in a given month
								for (var i = 0; i < oArrTime.length; i++) {
									var date = oArrTime[i].date.getDate();
									var flag = 0;
									for (var j = 0; j < leaveRecords.length; j++) {
										if (date === leaveRecords[j].__data.DateFrom.getDate()) {
											if (flag === 0) {
												for (var k = 0; k < leaveRecords[j].__data.Days; k++) {
													flag = 1;
													oArrTime[i].hours = 'LEAVE';
													oArrTime[i].LeaveType = leaveRecords[j].__data.LeaveType;
													i++;
												}
											} else {
												break;
											}
										}
									}
								}


								//this for loop is to find and assign Holiday for employee for given month
								for (var i = 0; i < oArrTime.length; i++) {
									if (empRecord.__data.Holiday === "Sunday") {
										if (oArrTime[i].date.getDay() === 0) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Monday") {
										if (oArrTime[i].date.getDay() === 1) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Tuesday") {
										if (oArrTime[i].date.getDay() === 2) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Wednesday") {
										if (oArrTime[i].date.getDay() === 3) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Thursday") {
										if (oArrTime[i].date.getDay() === 4) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Friday") {
										if (oArrTime[i].date.getDay() === 5) {
											oArrTime[i].hours = 'Holiday';
										}
									} else if (empRecord.__data.Holiday === "Saturday") {
										if (oArrTime[i].date.getDay() === 6) {
											oArrTime[i].hours = 'Holiday';
										}
									}
								}
								// console.log(that3.empRecord);
								// console.log(that3.leaveRecords);
								var timeTrackerCalendar = [];
								Holidays.find(
									{ where: { Date: { between: [startDateCurrent, endDateCurrent] } }, order: 'Date ASC' }
								).then(function (holidayRecords) {
									var noOfDaysInMonth = new Date(new Date(month).getFullYear(), new Date(month).getMonth() + 1, 0).getDate();
									for (var i = 0; i < oArrTime.length; i++) {
										var date = oArrTime[i].date;
										var flag = 0;
										for (var j = 0; j < holidayRecords.length; j++) {
											var hDate = holidayRecords[j].__data.Date;
											if (date.getDate() == hDate.getDate()) {
												flag = 1;
												timeTrackerCalendar.push({
													Day: holidayRecords[j].__data.Day,
													Occasion: holidayRecords[j].__data.Occasion,
													remark: "PH",
													hours: oArrTime[j].hours,
													Date: oArrTime[j].date,
													LeaveType: oArrTime[j].LeaveType
												});
											}
										}
										if (flag == 0) {
											timeTrackerCalendar.push({
												Day: "",
												Occasion: "",
												remark: "",
												hours: oArrTime[i].hours,
												Date: oArrTime[i].date,
												LeaveType: oArrTime[i].LeaveType
											});
										}

									}
									res.send(timeTrackerCalendar);
								});

							} else {
								console.log("There is no data available the selected month ");
								res.send(oArrTime);
							}

						});

					});

				});
			}

		});

		app.get("/getWardDataByBatch", function (req, res) {

			//https://loopback.io/doc/en/lb2/Querying-data.html

			//Step 1: get the batch if which you pass from fiori apps

			//Step 2: Find all subscriptions for that batchs
			//Sub.find({batchId: sId}).then(function(data){   })
			//Step 3: make an array of all the students in those subs
			//Step 4: Fire find on Ward table with all the IDs
			//Step 5: Student Name, id, blood etc.. --> Inquiry

			//Since all work is sync - use waterfall module as showen getAmountPerAccount
			var sId = req.query.sId;
			var Subs = app.models.Sub;
			var Courses = app.models.Course;

			var Wards = app.models.Ward;
			var Inquiry = app.models.Inquiry;

			var async = require('async');
			async.waterfall([
				function (callback) {

					Courses.find({
						where: {
							and: [{
								id: sId  //Will be replaces by sId on the time of call
							}]
						}
					}).then(function (subsDetails) {
						callback(null, subsDetails);
					});
				},
				function (subsDetails, callback) {
					var sCourseId = subsDetails[0].__data.id.toString()
					Subs.find({
						where: {
							and: [{
								CourseId: sCourseId
							}]
						}
					})
						.then(function (studentsDetail, err) {
							callback(null, subsDetails, studentsDetail);
							console.log(studentsDetail);
						});
				},
				function (subsDetails, studentsDetail, callback) {
					var array = [];
					for (let index = 0; index < studentsDetail.length; index++) {
						const element = studentsDetail[index];
						var sStudentSubId = studentsDetail[index].__data.StudentId.toString();
						array.push(sStudentSubId);
					}

					Wards.find({
						where: {
							and: [{
								id: {
									inq: array
								}

							}]
						}
					})
						.then(function (Records, err) {
							callback(null, subsDetails, studentsDetail, Records);
						});
				},
				function (subsDetails, studentsDetail, Records, callback) {
					var oArray = [];
					for (let index = 0; index < Records.length; index++) {
						const element = Records[index];
						var sStudentId = Records[index].__data.InquiryId.toString();
						oArray.push(sStudentId);
					}

					Inquiry.find({
						where: {
							and: [{
								id: {
									inq: oArray
								}
							}]
						}
					})
						.then(function (aStudentsData, err) {
							callback(null, subsDetails, studentsDetail, Records, aStudentsData);
							res.send(aStudentsData);
							console.log(aStudentsData);
						});
				}
			],
				function (err, subsDetails, studentsDetail, Records, aStudentsData,) {
					// result now equals 'done'
					try {
						var idCardData = [];
						for (var i = 0; i < studentsDetail.length; i++) {
							var element = studentsDetail[i];
							var detail = Records[i];
							var parentDetail = aStudentsData[i];
							const dob = Records[i].__data.DOB;
							// Get today's date
							const today = new Date();
							// Calculate the person's age
							let age = today.getFullYear() - dob.getFullYear();
							// Check if the person's birthday has already happened this year
							const monthDiff = today.getMonth() - dob.getMonth();
							if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
								age--;
							}
							var oParent = aStudentsData.filter(function (ele) {
								return ele.id.toString() == Records[i].InquiryId.toString();
							})
							idCardData.push({
								"RollNo": Records[i].__data.RollNo,
								"Name": Records[i].__data.Name,
								"Gender": Records[i].__data.Gender,
								"Age": age,
								"Address": oParent[0].Address,
								"Phone": oParent[0].Phone,
								"BloodGroup": Records[i].__data.BloodGroup,
								"Photo": Records[i].__data.Photo
							});

						}

						
						res.send(idCardData);
					} catch (e) {

					} finally {

					}
				}
			);
		});

		app.get("/getAllData", function (req, res) {

			var sId = req.query.sId;
			var Subs = app.models.Sub;
			var Courses = app.models.Course;

			var Wards = app.models.Ward;
			var Inquiry = app.models.Inquiry;

			var async = require('async');
			async.waterfall([
				function (callback) {

					Inquiry.find({}).then(function (parentData) {
						callback(null, parentData);
					});
				},
				function (parentData, callback) {
					
					var sCourseIds = [...new Set(parentData.map(item => item.id.toString()))];
					// var sCourseId = parentData[0].__data.id.toString()
					Wards.find({
						where: {
							and: [{
								InquiryId: {
									inq: sCourseIds
								}
							}]
						}
					})
						.then(function (studentsDetail, err) {
							callback(null, parentData, studentsDetail);
							console.log(studentsDetail);
						});
				},
				function (parentData, studentsDetail, callback) {
					var array = [];
					for (let index = 0; index < studentsDetail.length; index++) {
						const element = studentsDetail[index];
						// var sStudentSubId = studentsDetail[index].__data.StudentId.toString();
						// array.push(sStudentSubId);
						// element.CourseName 
						for (let i = 0; i < element.CourseName.length; i++) {
							const ele = element.CourseName[i];
							array.push(ele);
						}
					}

					Courses.find({
						where: {
							and: [{
								CourseId: {
									inq: array
								}

							}]
						}
					})
						.then(function (Records, err) {
							callback(null, parentData, studentsDetail, Records);
						});
				},
				function (parentData, studentsDetail, Records, callback) {
					// var array = [];
					var sArayIds = [...new Set(studentsDetail.map(item => item.id.toString()))];
					

					Subs.find({
						where: {
							and: [{
								StudentId: {
									inq: sArayIds
								}

							}]
						}
					})
						.then(function (Subs, err) {
							callback(null, parentData, studentsDetail, Records, Subs);
						});
				}
			],
				function (err, parentData, studentsDetail, Records,Subs) {
					// result now equals 'done'
					
					try {
						var allData = [];
						for (var i = 0; i < studentsDetail.length; i++) {
							var oParent = parentData.filter(function(ele){
								return ele.__data.id.toString()===studentsDetail[i].__data.InquiryId.toString();
							});
							var oCurse;
							for (let index = 0; index < studentsDetail[i].__data.CourseName.length; index++) {
								const element = studentsDetail[i].__data.CourseName[index];
								oCurse=Records.filter(function(ele){
									return ele.__data.CourseId.toString()===element.toString()
								});
								var oSubs=Subs.filter(function(ele){
									// return ele.__data.CourseId.toString()===oCurse[0].__data.id.toString() && 
									return ele.__data.StudentId.toString() === studentsDetail[i].__data.id.toString()
								},oCurse);
								allData.push({
									"ParentName": oParent[0].__data.FatherName,
									"WardName": studentsDetail[i].__data.Name,
									"ParentMailId":  oParent[0].__data.EmailId,
									"ContactNo":  oParent[0].__data.Phone,
									"Course": oCurse[0].__data.BatchNo,
									"RegistrationDate": oSubs.length>0 ? oSubs[0].__data.CreatedOn ? oSubs[0].__data.CreatedOn.toLocaleString('en-GB', {
										hour12: false,
									  }):oSubs[0].__data.CreatedOn :null
								});
	
							}
							
							
						}

						
						res.send(allData);
					} catch (e) {
						debugger;
					} finally {

					}
				}
			);
		});


		app.post('/requestMessage', function (req, res) {

			var msg = "";
			var typeMsg = req.body.msgType;
			var generateOTP = function () {

				// Declare a digits variable
				// which stores all digits
				var digits = '0123456789';
				let OTP = '';
				for (let i = 0; i < 6; i++) {
					OTP += digits[Math.floor(Math.random() * 10)];
				}
				return OTP;
			}
			switch (typeMsg) {
				case "OTP":
					//msg = "Dear #FirstName#, Greetings from www.anubhavtrainings.com, we have sent the course details to your email id, please write to us on contact@anubhavtrainings.com";
					var myOTP = generateOTP();
					//msg = myOTP + " is the OTP for your login, Please do not share OTP with anyone. Soyuz Technologies LLP";
					msg = myOTP + " is your OTP for login, please do not share OTP with anyone. Soyuz Technologies LLP ";
					break;
				case "WARDREG":
					msg = 'Thanks for registering with EVOS Solutions, Your enrollment is confirmed and fees was received. Soyuz Technologies LLP';
					break;
				default:
					return;

			}

			var http = require('https');
			var urlencode = require('urlencode');
			msg = urlencode(msg);
			console.log("SMS Sending --- " + msg);
			var number = req.body.Number;
			//var username='anubhav.abap@gmail.com';
			var username = 'contact@soyuztechnologies.com';
			var hash = 'ed5385054838bb0d98685409492911dfcc4efade08f2d75e4583ae61fa54c2f2';

			// The hash key could be found under Help->All Documentation->Your hash key.
			// Alternatively you can use your Textlocal password in plain text.
			//var hash = 'eef684d01be7535d39d7f409a1b8e888f874e9a05243b4fb3db2426f99aed5ba';
			//var sender='ONLTRN';
			var sender = "395558";
			if(typeMsg === ""){
				 sender = "SOYUZT";

			}
			var data = 'username=' + username + '&hash=' + hash + '&sender=' + sender + '&numbers=' + number + '&message=' + msg
			var options = {
				host: 'api.textlocal.in',
				path: '/send?' + data
			};
			callback = function (response) {
				var str = '';
				response.on('data', function (chunk) {
					str += chunk;
				});

				//the whole response has been recieved, so we just print it out here
				response.on('end', function () {
					if (typeMsg === "OTP") {
						var Otp = app.models.Otp;
						var newRec = {
							CreatedOn: new Date(),
							Attempts: 1,
							OTP: myOTP,
							Number: req.body.Number
						};
						Otp.upsert(newRec)
							.then(function (inq) {
								res.send("OTP Send Successfully");
								// console.log("created successfully");
							})
							.catch(function (err) {
								console.log(err);
							});

					} else {
						res.send("message sent");
					}
					console.log(str);
				});
			}
			//console.log('hello js'))
			//console.log(options.host + options.path);
			http.request(options, callback).end();
		});

		app.get("/validateOtp", function (req, res) {
			var Otp = app.models.Otp;
			var oNumber = req.query.email;
			// var OTP = req.query.OTP;
			Otp.findOne({
				where: {
					and: [{
						Number: req.query.email
					}, {
						OTP: req.query.OTP
					}]
				}
			})
				.then(async function (inq) {
					if (inq) {
						// const key = require('./samples.json');
						var Param = app.models.Param;
						var array = ["appLoginEmail", "appLoginPassword"];

						var oParams = await Param.find({
							where: {
								and: [{
									Code: {
										inq: array
									}

								}]
							}
						}).then();
						var loginPayload = {
							"email": '',
							"password": ''
						};
						// 	function (Data, err) {
						for (let index = 0; index < oParams.length; index++) {
							const element = oParams[index].__data;
							if (element.Code === "appLoginEmail") {
								loginPayload.email = element.Value;
							}
							if (element.Code === "appLoginPassword") {
								loginPayload.password = element.Value;
							}
						}
						// });

						
						// var loginPayload = {
						// 	"email": this.loginEmail,
						// 	"password": this.loginPassword
						// };

						// var Otp = app.models.Otp;
						
						await Otp.deleteById(oNumber);
						

						var User = app.models.User;
						var d = await User.login(loginPayload);
						// var d = await $.post(app.get('url')+'api/Users/login', loginPayload).done(

						// )
						res.send(d);

					} else {
						res.send(false);
					}

					console.log("created successfully");
				})
				.catch(function (err) {
					console.log(err);
					res.send(false);
				});
		});

		app.get('/getAmountPerAccount', function (req, res) {

			// Courses.find().then(function(data) {
			// 	// console.log("Test Course")
			// 	aCourses = data;
			// 	aCources.courses.forEach(function(oRec) {
			// 		oSubCounter[oRec.courseName] = 0;
			// 	})
			//
			// 	Object.keys(oSubCounter).forEach(function(key) {
			//
			// 		var oCount = data.filter(function(oRec) {
			// 			return key === oRec.Name;
			// 		})
			//
			// 		responseData.push({
			// 			"CourseName": key,
			// 			"Count": oCount.length
			// 		})
			//
			// 	})
			//--- Calculate total per batch, prepare json and return
			var responseData = [];
			var oSubCounter = {};
			var Subs = app.models.Sub;
			var Account = app.models.Account;
			var AccountEntry = app.models.AccountBalance;

			var async = require('async');
			async.waterfall([
				function (callback) {
					Account.find({
						fields: {
							"accountName": true,
							"accountNo": true,
							"ifsc": true,
							"current": true,
							"counter": true,
							"counterall": true,
							"key": true,
							"id": true
						}
					}).then(function (accountRecords) {
						callback(null, accountRecords);
					});
				},
				function (accountRecords, callback) {
					// arg1 now equals 'one' and arg2 now equals 'two'
					var date = new Date("2019-04-01");
					date.setHours(0, 0, 0, 0);
					AccountEntry.find({
						where: {
							and: [{
								CreatedOn: {
									gte: date
								}
							}]
						},
						fields: {
							"AccountNo": true,
							"Amount": true
						}
					})
						.then(function (accountBalances, err) {
							callback(null, accountRecords, accountBalances);
						});

				},
				function (accountRecords, accountBalances, callback) {
					// arg1 now equals 'three'
					var date = new Date("2019-04-01");
					date.setHours(0, 0, 0, 0);
					Subs.find({
						where: {
							and: [{
								PaymentDate: {
									gte: date
								}
							}]
						},
						fields: {
							"AccountName": true,
							"Amount": true

						}
					})
						.then(function (Records, err) {


							callback(null, accountRecords, accountBalances, Records);
						});
				}
			], function (err, accountRecords, accountBalances, Records) {
				// result now equals 'done'
				
				try {
					var responseData = [];
					for (var i = 0; i < accountRecords.length; i++) {
						try {
							var totalAmount = 0, newDeposits = 0;
							for (var j = 0; j < accountBalances.length; j++) {

								if (accountBalances[j].AccountNo.toString() === accountRecords[i].accountNo.toString()) {
									totalAmount
										= totalAmount +
										accountBalances[j].Amount;
								}

							}
							for (var k = 0; k < Records.length; k++) {
								if (Records[k].AccountName.toString() === accountRecords[i].accountNo.toString()) {
									totalAmount
										= totalAmount +
										Records[k].Amount;
									newDeposits = Records[k].Amount + newDeposits;
								}

							}

							responseData.push({
								"AccountNo": accountRecords[i].accountNo,
								"AccountName": accountRecords[i].accountName + " - " + accountRecords[i].ifsc,
								"NewDeposit": newDeposits,
								"Amount": totalAmount,
								"current": accountRecords[i].current,
								"counter": accountRecords[i].counter,
								"counterall": accountRecords[i].counterall,
								"key": accountRecords[i].key,
								"id": accountRecords[i].id
							});
							totalAmount, newDeposits = 0;
						} catch (e) {

						} finally {

						}
					}

					res.send(responseData);
				} catch (e) {

				} finally {

				}
			}
			);
		});
		app.get("/getDetailsAfterOTP", function (req, res) {

			var sId = 0;
			var Subs = app.models.Sub;
			var Courses = app.models.Course;
			var Wards = app.models.Ward;
			var Inquiry = app.models.Inquiry;

			var OTP = app.models.Otp;

			var async = require('async');
			async.waterfall([
				function (callback) {
					OTP.find({
						where: {
							and: [{
								Number: "9560466944"  //Will be replaces by Number on the time of call
							}]
						}
					}).then(function (UserDetail) {
						callback(null, UserDetail);
					});
				},
				function (UserDetail, callback) {
					var sPhoneNumber = "9560466944";  //
					Inquiry.find({
						where: {
							and: [{
								Phone: sPhoneNumber
							}]
						}
					})
						.then(function (CustomerDetail, err) {
							// callback(null, UserDetail, CustomerDetail);
							console.log(CustomerDetail);
							res.send(CustomerDetail);

						});
				}
			],
			);
		});
		app.post('/sendPaymentVerificationEmail', async function (req, res) {
			
			var nodemailer = require('nodemailer');
			var smtpTransport = require('nodemailer-smtp-transport');
			var xoauth2 = require('xoauth2');
			var Param = app.models.Param;
			var array = ['user', 'clientId', 'clientSecret', 'refreshToken'];
			var key = {};

			const sParam = await Param.find({
			  where: {
				and: [{
				  Code: {
					inq: array
				  }
				}]
			  }
			});

			for (let index = 0; index < sParam.length; index++) {
			  const element = sParam[index].__data;
			  if (element.Code === 'user') {
				key.user = element.Value;
			  }
			  if (element.Code === 'clientId') {
				key.clientId = element.Value;
			  }
			  if (element.Code === 'clientSecret') {
				key.clientSecret = element.Value;
			  }
			  if (element.Code === 'refreshToken') {
				key.refreshToken = element.Value;
			  }
			}

			const fs = require('fs');
			this.htmlTemplate = fs.readFileSync(process.cwd() + "/server/sampledata/" + 'SubscriptionEmailTemplate.html', 'utf8');
			const { Parent_Name, Camper_Name, Camp_Program_Name, Program_Dates, Payment_Amount, Payment_Date, Payment_Method, Email } = req.body;

			this.htmlTemplate = this.htmlTemplate
			  .replace('$$Parent_Name$$', Parent_Name)
			  .replace(/\$\$Camper_Name\$\$/g, Camper_Name)
			  .replace('$$Camp_Program_Name$$', 'Summer Camp 2023')
			  .replace('$$Program_Dates$$', '20th May - 20th June 2023')
			  .replace('$$Payment_Amount$$', Payment_Amount)
			  .replace('$$Payment_Date$$', Payment_Date)
			  .replace('$$Payment_Method$$', Payment_Method);

			const transporter = nodemailer.createTransport(smtpTransport({
			  service: 'gmail',
			  host: 'smtp.gmail.com',
			  auth: {
				xoauth2: xoauth2.createXOAuth2Generator({
				  user: key.user,
				  clientId: key.clientId,
				  clientSecret: key.clientSecret,
				  refreshToken: key.refreshToken
				})
			  }
			}));

			// var ccs = [];
			var emailContent = {};
			var Subject = "Payment Verification";
			emailContent = {
			  from: 'contact@evotrainingsolutions.com',
			  to: Email,
			  subject:Subject,
			  html: this.htmlTemplate
			};

			transporter.sendMail(emailContent, function (error, info) {
			  if (error) {
				console.log(error);
				if (error.code === 'EAUTH') {
				  res.status(500).send('Username and Password not accepted, Please try again.');
				} else {
				  res.status(500).send('Internal Error while Sending the email, Please try again.');
				}
			  } else {
				
				console.log('Email sent: ' + info.response);
				res.send('Email sent successfully');
			  }
			});
		  });

		app.post('/sendOtpViaEmail',
			async function (req, res) {
				
				var nodemailer = require('nodemailer');
				var smtpTransport = require('nodemailer-smtp-transport');
				const xoauth2 = require('xoauth2');
				// const key = require('./samples.json');
				var array = ["user", "clientId", "clientSecret", "refreshToken"];
				var Param = app.models.Param;
				var key = {};
				var sParam = await Param.find({
					where: {
						and: [{
							Code: {
								inq: array
							}

						}]
					}
				}).then();
				for (let index = 0; index < sParam.length; index++) {
					const element = sParam[index].__data;
					if (element.Code === "user") {
						key.user = element.Value;
					}
					if (element.Code === "clientId") {
						key.clientId = element.Value;
					}
					if (element.Code === "clientSecret") {
						key.clientSecret = element.Value;
					}
					if (element.Code === "refreshToken") {
						key.refreshToken = element.Value;
					}
				}

				/*
				data from param table
				var key={}
				key.user=-elee
				key.user=-elee
				key.user=-elee
				key.user=-elee
				*/
				const fs = require('fs');
				console.log(req.body);
				this.mailContent = fs.readFileSync(process.cwd() + "/server/sampledata/" + 'otp.html', 'utf8');
				var generateOTP = function () {

					// Declare a digits variable
					// which stores all digits
					var digits = '0123456789';
					let OTP = '';
					for (let i = 0; i < 6; i++) {
						OTP += digits[Math.floor(Math.random() * 10)];
					}
					return OTP;
				}
				var OTP = generateOTP();

				this.mailContent = this.mailContent.replace("$$OTP$$", OTP);

				var transporter = nodemailer.createTransport(smtpTransport({
					service: 'gmail',
					host: 'smtp.gmail.com',
					auth: {
						xoauth2: xoauth2.createXOAuth2Generator({
							user: key.user,
							clientId: key.clientId,
							clientSecret: key.clientSecret,
							refreshToken: key.refreshToken
						})
					}
				}));

				// email Subject ====  yet to Code

				var ccs = [];
				var emailContent = {};
				var Email = req.body.eMail
				var Subject = "Verify Your OTP For Evosolutions Registration";
				emailContent = {
					from: 'contact@evotrainingsolutions.com',
					to: Email, //req.body.EmailId    FirstName  CourseName
					cc: ccs,
					subject: Subject,
					html: this.mailContent
				};

				transporter.sendMail(emailContent, function (error, info) {
					
					if (error) {
						console.log(error);
						if (error.code === "EAUTH") {
							res.status(500).send('Username and Password not accepted, Please try again.');
						} else {
							res.status(500).send('Internal Error while Sending the email, Please try again.');
						}
					} else {
						console.log('Email sent: ' + info.response);
						res.send("email sent");
						var Otp = app.models.Otp;
						var newRec = {
							CreatedOn: new Date(),
							Attempts: 1,
							OTP: OTP,
							Number: Email
						};
						Otp.upsert(newRec)
							.then(function (inq) {
								res.send("OTP Send Successfully");
								// console.log("created successfully");
							})
							.catch(function (err) {
								console.log(err);
							});
					}
				});

			});

		app.get('/getBatchPerCourse', function (req, res) {
			var responseData = [];
			var fs = require('fs');
			var aCources = JSON.parse(fs.readFileSync('../OFTProject/client/models/mockData/sampledata.json', 'utf8'));

			var oSubCounter = {};

			var Courses = app.models.Course;

			Courses.find().then(function (data) {
				// console.log("Test Course")
				aCourses = data;
				aCources.courses.forEach(function (oRec) {
					oSubCounter[oRec.courseName] = 0;
				})

				Object.keys(oSubCounter).forEach(function (key) {

					var oCount = data.filter(function (oRec) {
						return key === oRec.Name;
					})

					responseData.push({
						"CourseName": key,
						"Count": oCount.length
					})

				})
				//--- Calculate total per batch, prepare json and return
				res.send(responseData);
			})
		});

		app.get('/getStudentPerCourse', function (req, res) {
			var responseData = [];
			var fs = require('fs');
			var aCources = JSON.parse(fs.readFileSync('../OFTProject/client/models/mockData/sampledata.json', 'utf8'));
			var aCourseFinal = [];

			var Courses = app.models.Course;
			var Sub = app.models.Sub;

			Courses.find().then(function (data) {
				aCourcesFind = data;

				aCources.courses.forEach(function (oCouRec) {
					var oSubCounter = {};
					// oSubCounter[oCouRec.courseName] = 0;
					oSubCounter["Name"] = oCouRec.courseName;
					var aBatches = data.filter(function (oRec) {
						return oCouRec.courseName === oRec.Name;
					})
					oSubCounter["Batches"] = aBatches;
					aCourseFinal.push(oSubCounter);
				})

				Sub.find({

				}).then(function (data) {

					for (i = 0; i < aCourseFinal.length; i++) {
						var aSubBatches = [];
						for (j = 0; j < aCourseFinal[i].Batches.length; j++) {
							aSubBatches = data.filter(function (oRec) {
								return aCourseFinal[i].Batches[j].id.toString() === oRec.CourseId.toString();
							})
						}

						responseData.push({
							"CourseName": aCourseFinal[i].Name,
							"Count": aSubBatches.length
						})
					}
					res.send(responseData);
				})
			})
		});

		app.get('/getCountLastMonths', function (req, res) {
			var responseData = [];
			var app = require('../server/server');
			var Sub = app.models.Sub;

			function getMonths() {
				var iCount = 4;
				var aMonths = [];

				while (iCount > -1) {
					var oDate = new Date();
					oDate.setMonth(oDate.getMonth() - iCount);
					var oStartDate = new Date(oDate.getFullYear(), oDate.getMonth(), 1);
					var oEndDate = new Date(oDate.getFullYear(), oDate.getMonth() + 1, 0);

					aMonths.push({
						StartDate: oStartDate,
						EndDate: oEndDate
					})

					iCount = iCount - 1;
				}

				return aMonths;
			}

			var aMonths = getMonths();
			var oPeriodStartDate = aMonths[4].StartDate;
			var oPeriodEnddate = aMonths[0].EndDate;
			Sub.find({
				// where: {
				// 	or: aOrCond
				// }
			}).then(function (data) {
				Date.prototype.getMonthText = function () {
					var months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
					return months[this.getMonth()];
				}
				// var aStudents = [];
				for (var j = 0; j < aMonths.length; j++) {

					aStudents = data.filter(function (oRec) {
						return oRec.CreatedOn >= aMonths[j].StartDate && oRec.CreatedOn <= aMonths[j].EndDate
					})

					responseData.push({
						Month: aMonths[j].StartDate.getMonthText(),
						Count: aStudents.length
					})

				}
				res.send(responseData);

			})

		});

		app.get('/ServerDownloadExp', function (req, res) {
			var date = new Date();
			Server.find({
				where: {
					and: [{
						EndDate: {
							lt: date
						}
					}, {
						UserEndDate: {
							lt: date
						}
					}]
				}
			})
				.then(function (Records, err) {
					if (Records) {

						var excel = require('exceljs');
						var workbook = new excel.Workbook(); //creating workbook
						var sheet = workbook.addWorksheet('MySheet'); //creating worksheet
						sheet.addRow().values = Object.keys(Records[0].__data);

						for (var i = 0; i < Records["length"]; i++) {
							sheet.addRow().values = Object.values(Records[i].__data);
						}

						var tempfile = require('tempfile');
						var tempFilePath = tempfile('.xlsx');
						console.log("tempFilePath : ", tempFilePath);
						workbook.xlsx.writeFile(tempFilePath).then(function () {
							res.sendFile(tempFilePath, function (err) {
								if (err) {
									console.log('---------- error downloading file: ', err);
								}
							});
							console.log('file is written @ ' + tempFilePath);
						});

					}
				}

				);
		});


		app.post('/TakeBackup', function (req, res) {

			var dbUri = "mongodb://anubhav:GbPOHnk2JSfbe44g@oft-shard-00-00-kyg3j.mongodb.net:27017/prod";

			const MongoDB = require('backup-manager').MongoDBPlugin;

			// path should be created before creating an instance
			var sPath = "./";
			const mongo = new MongoDB({
				debug: true,
				path: sPath
			});
			mongo.backup(['--host mongodb://anubhav:GbPOHnk2JSfbe44g@oft-shard-00-00-kyg3j.mongodb.net:27017', '--db test', '--gzip'], error => console.log(error));

			console.log("backup done");
			res.send("backup completed success");

		});

		app.get('/ServerPayDownload', function (req, res) {

			ServerPay.find({})
				.then(function (Records, err) {
					if (Records) {

						var excel = require('exceljs');
						var workbook = new excel.Workbook(); //creating workbook
						var sheet = workbook.addWorksheet('MySheet'); //creating worksheet

						sheet.addRow().values = Object.keys(Records[0].__data);

						for (var i = 0; i < Records["length"]; i++) {
							sheet.addRow().values = Object.values(Records[i].__data);
						}

						var tempfile = require('tempfile');
						var tempFilePath = tempfile('.xlsx');
						console.log("tempFilePath : ", tempFilePath);
						workbook.xlsx.writeFile(tempFilePath).then(function () {
							res.sendFile(tempFilePath, function (err) {
								console.log('---------- error downloading file: ', err);
							});
							console.log('file is written @ ' + tempFilePath);
						});

					}
				}

				);
		});

		var Inquiry = app.models.Inquiry;
		app.get('/InquiryDownload', function (req, res) {

			Inquiry.find({})
				.then(function (Records, err) {
					if (Records) {

						var excel = require('exceljs');
						var workbook = new excel.Workbook(); //creating workbook
						var sheet = workbook.addWorksheet('MySheet'); //creating worksheet
						sheet.addRow().values = Object.keys(Records[0].__data);
						for (var i = 0; i < Records["length"]; i++) {
							sheet.addRow().values = Object.values(Records[i].__data);
						}
						var tempfile = require('tempfile');
						var tempFilePath = tempfile('.xlsx');
						console.log("tempFilePath : ", tempFilePath);
						workbook.xlsx.writeFile(tempFilePath).then(function () {
							res.sendFile(tempFilePath, function (err) {
								console.log('---------- error downloading file: ', err);
							});
							console.log('file is written @ ' + tempFilePath);
						});

					}
				}

				);
		});

		app.get('/SubNotExpired', function (req, res) {

			var app = require('../server/server');
			var Sub = app.models.Sub;
			var Students = app.models.Student;
			var Courses = app.models.Course;
			var async = require('async');
			
			async.waterfall([
				function (callback) {
					Students.find().then(function (students) {
						var allStudents = [];
						for (var i = 0; i < students.length; i++) {
							allStudents[students[i].id] = students[i];
						}
						callback(null, allStudents);
					});

				},
				function (students, callback) {
					// arg1 now equals 'one' and arg2 now equals 'two'
					Courses.find().then(function (courses) {
						var allCourses = [];
						for (var i = 0; i < courses.length; i++) {
							allCourses[courses[i].id] = courses[i];
						}
						callback(null, students, allCourses);
					});

				},
				function (students, courses, callback) {
					// arg1 now equals 'three'
					var today = new Date();

					Sub.find({
						where: {
							and: [{
								MostRecent: true
							},
							{
								EndDate: {
									gte: today
								}
							}
							]
						}
					}).then(function (Subs) {
						var allSubs = [];
						for (var i = 0; i < Subs.length; i++) {
							var record = Subs[i];
							try {
								allSubs.push({
									"BlogEndDate": record.EndDate,
									"Batch": courses[record.CourseId].BatchNo,
									"Student": students[record.StudentId].GmailId,
									"IsDue": record.PartialPayment,
									"Name": students[record.StudentId].Name,
									"Course": courses[record.CourseId].Name,
									"DueAmount": record.PendingAmount,
									"DueDate": record.PaymentDueDate
								});
							} catch (e) {

							}
						}
						callback(null, allSubs);
					});

				}
			], function (err, Records) {
				// result now equals 'done'
				try {
					
					var excel = require('exceljs');
					var workbook = new excel.Workbook(); //creating workbook
					var sheet = workbook.addWorksheet('MySheet'); //creating worksheet
					sheet.addRow().values = Object.keys(Records[0]);

					for (var i = 0; i < Records["length"]; i++) {
						sheet.addRow().values = Object.values(Records[i]);
					}

					var tempfile = require('tempfile');
					var tempFilePath = tempfile('.xlsx');
					console.log("tempFilePath : ", tempFilePath);
					workbook.xlsx.writeFile(tempFilePath).then(function () {
						res.sendFile(tempFilePath, function (err) {
							if (err) {
								console.log('---------- error downloading file: ', err);
							}
						});
						console.log('file is written @ ' + tempFilePath);
					});
				} catch (e) {

				} finally {

				}
			});
		});

		app.get('/SubDownload', function (req, res) {

			var app = require('../server/server');
			var Sub = app.models.Sub;
			var Students = app.models.Student;
			var Courses = app.models.Course;
			var async = require('async');
			
			async.waterfall([
				function (callback) {
					Students.find().then(function (students) {
						var allStudents = [];
						for (var i = 0; i < students.length; i++) {
							allStudents[students[i].id] = students[i];
						}
						callback(null, allStudents);
					});

				},
				function (students, callback) {
					// arg1 now equals 'one' and arg2 now equals 'two'
					Courses.find().then(function (courses) {
						var allCourses = [];
						for (var i = 0; i < courses.length; i++) {
							allCourses[courses[i].id] = courses[i];
						}
						callback(null, students, allCourses);
					});

				},
				function (students, courses, callback) {
					// arg1 now equals 'three'
					Sub.find({
						where: {
							MostRecent: true
						}
					}).then(function (Subs) {
						var allSubs = [];
						for (var i = 0; i < Subs.length; i++) {
							var record = Subs[i];
							try {
								allSubs.push({
									"Batch": courses[record.CourseId].BatchNo,
									"Student": students[record.StudentId].GmailId,
									"IsDue": record.PartialPayment,
									"Name": students[record.StudentId].Name,
									"Course": courses[record.CourseId].Name,
									"DueAmount": record.PendingAmount,
									"DueDate": record.PaymentDueDate
								});
							} catch (e) {

							}
						}
						callback(null, allSubs);
					});

				}
			], function (err, Records) {
				// result now equals 'done'
				try {
					
					var excel = require('exceljs');
					var workbook = new excel.Workbook(); //creating workbook
					var sheet = workbook.addWorksheet('MySheet'); //creating worksheet
					sheet.addRow().values = Object.keys(Records[0]);

					for (var i = 0; i < Records["length"]; i++) {
						sheet.addRow().values = Object.values(Records[i]);
					}

					var tempfile = require('tempfile');
					var tempFilePath = tempfile('.xlsx');
					console.log("tempFilePath : ", tempFilePath);
					workbook.xlsx.writeFile(tempFilePath).then(function () {
						res.sendFile(tempFilePath, function (err) {
							if (err) {
								console.log('---------- error downloading file: ', err);
							}
						});
						console.log('file is written @ ' + tempFilePath);
					});
				} catch (e) {

				} finally {

				}
			});
		});

		var Stud = app.models.Student;

		app.get('/StudentDownload', function (req, res) {

			Stud.find({})
				.then(function (Records, err) {
					if (Records) {

						var excel = require('exceljs');
						var workbook = new excel.Workbook(); //creating workbook
						var sheet = workbook.addWorksheet('MySheet'); //creating worksheet
						sheet.addRow().values = Object.keys(Records[0].__data);
						for (var i = 0; i < Records["length"]; i++) {
							sheet.addRow().values = Object.values(Records[i].__data);
						}

						var tempfile = require('tempfile');
						var tempFilePath = tempfile('.xlsx');
						console.log("tempFilePath : ", tempFilePath);
						workbook.xlsx.writeFile(tempFilePath).then(function () {
							res.sendFile(tempFilePath, function (err) {
								if (err) {
									console.log('---------- error downloading file: ', err);
								}
							});
							console.log('file is written @ ' + tempFilePath);
						});

					}
				}

				);
		});

		app.post('/fillColl',
			function (req, res) {
				var app = require('../server/server');
				var Students = app.models.Student;
				var Courses = app.models.Course;
				this.students = [];
				this.courses = [];
				Students.find().then(function (students) {
					for (var i = 0; i < students.length; i++) {
						this.students[students[i].id] = students[i];
					}
				});
				Courses.find().then(function (courses) {
					for (var i = 0; i < courses.length; i++) {
						this.courses[courses[i].id] = courses[i];
					}
				});
			});

		app.post('/markCheckedAccount',
			function (req, res) {
				var app = require('../server/server');
				var Account = app.models.Account;
				var boolVal = req.body.State;
				Account.findOne({
					where: {
						accountNo: req.body.AccountNo
					}
				}).then(function (item) {
					if (item) {
						var app = require('../server/server');
						var Account = app.models.Account;
						var id = item.id;
						var updateObj = {
							current: boolVal
						};
						Account.findById(id).then(function (instance) {
							instance.updateAttributes(updateObj);
							return res.send("done");
						});
					}
				})
					.catch(function (err) {
						console.log(err);
					});
			}
		);
		app.post('/getAllForAccount',
			function (req, res) {
				var app = require('../server/server');
				var Sub = app.models.Sub;
				var date = new Date();
				date.setDate(date.getDate() - 7);
				Sub.find({
					where: {
						and: [{
							AccountName: req.body.AccountNo
						}
							// ,
							// {
							// 	PaymentDate: {
							// 		gt: date
							// 	}
							// }
						]
					},
					fields: {
						"PaymentDate": true,
						"Amount": true,
						"Remarks": true
					}
				}
				).then(function (data) {
					res.send(data);
				});
			}
		);
		app.post('/ResetPassword',
			function (req, res) {
				var app = require('../server/server');
				var Account = app.models.Account;
				var id = req.body.id;
				var updateObj = {
					key: req.body.key
				};
				Account.findById(id).then(function (instance) {
					instance.updateAttributes(updateObj);
					console.log("done");
					res.send("done");
				});
			}
		);
		app.post('/ResetCounter',
			function (req, res) {
				var app = require('../server/server');
				var Account = app.models.Account;
				var id = req.body.id;
				var updateObj = {
					counterall: 0
				};
				Account.findById(id).then(function (instance) {
					instance.updateAttributes(updateObj);
					console.log("done");
					res.send("done");
				});
			}
		);
		app.post('/MoveNextAc',
			function (req, res) {
				var app = require('../server/server');
				var Account = app.models.Account;
				Account.find({
					where: {
						current: true
					}
				})
					.then(function (allAc) {
						allAc = allAc.sort(function (a, b) {
							return a.counterall > b.counterall;
						});
						var item = allAc[0];
						var app = require('../server/server');
						var Account = app.models.Account;
						var id = item.id;
						var updateObj = {
							counter: item.counter + 1,
							counterall: item.counterall + 1
						};
						Account.findById(id).then(function (instance) {
							instance.updateAttributes(updateObj);
							console.log(instance);
							res.send(instance);
						});
					})
					.catch(function (err) {
						console.log(err);
					});
			}
		);
		app.post('/updateInq',
			function (req, res) {
				var app = require('../server/server');
				var Subs = app.models.Sub;
				Subs.find()
					.then(function (subs) {
						for (var i = 0; i < subs.length; i++) {
							var item = subs[i];
							//console.log("found course for student id " + item.StudentId + " course id " + item.CourseId);
							// var app = require('../server/server');
							// var Student = app.models.Student;
							// var Course = app.models.Course;
							// Student.findById(item.StudentId).then(function(singleStu){
							//     console.log(singleStu.GmailId);
							// });
							// Course.findById(item.CourseId).then(function(singleStu){
							//     console.log(singleStu.BatchNo);
							// });
							var app = require('../server/server');
							var Subs = app.models.Sub;
							var id = item.id;
							var updateObj = {
								Status: "Access granted"
							};
							Subs.findById(id).then(function (instance) {
								return instance.updateAttributes(updateObj);
							});
						}
					})
					.catch(function (err) {
						console.log(err);
					});




			}
		);

		app.post('/sendServerEmail',
			function (req, res) {
				var payload = req.body;
				var that = this;
				this.password = req.body.password;
				this.mailContent = fs.readFileSync(process.cwd() + "\\server\\sampledata\\" + 'server.html', 'utf8');
				//if partial payment is true update the due amount and due values
				Date.prototype.toShortFormat = function () {
					var month_names = ["Jan", "Feb", "Mar",
						"Apr", "May", "Jun",
						"Jul", "Aug", "Sep",
						"Oct", "Nov", "Dec"
					];

					var day = this.getDate();
					var month_index = this.getMonth();
					var year = this.getFullYear();

					return "" + day + "-" + month_names[month_index] + "-" + year;
				}
				var x = new Date(payload.EndDate);
				this.mailContent = this.mailContent.replace("$$EndDate$$", x.toShortFormat());
				this.mailContent = this.mailContent.replace("$$UserName$$", '<b href="http://www.onlinefioritrainings.com">' + payload.User + '</a>');
				this.mailContent = this.mailContent.replace("$$Password$$", '<b href="http://www.onlinefioritrainings.com/sap-technical-training">' + payload.PassRDP + '</a>');
				var app = require('../server/server');
				var Student = app.models.Student;
				this.StudentId = req.body.StudentId;
				Student.findById(this.StudentId).then(function (singleStu) {
					that.studentEmailId = singleStu.GmailId;
					that.studentName = singleStu.Name.split(" ")[0];
					///Replace the link in the contents
					that.studentName = that.studentName.replace(/([A-Z])/g, " $1");
					that.studentName = that.studentName.charAt(0).toUpperCase() + that.studentName.slice(1);
					if (studentName === "" || studentName === undefined || studentName === "null") {
						studentName = "Sir";
					}
					var nodemailer = require('nodemailer');
					var smtpTransport = require('nodemailer-smtp-transport');
					var transporter = nodemailer.createTransport(smtpTransport({
						service: 'gmail',
						host: 'smtp.gmail.com',
						auth: {
							user: 'install.abap@gmail.com',
							pass: that.password
						}
					}));
					var Subject = "[CONFIDENTIAL] SAP Server Subscription";
					//https://myaccount.google.com/lesssecureapps?pli=1
					that.mailContent = that.mailContent.replace('$$Name$$', that.studentName)
					var mailOptions = {
						from: 'install.abap@gmail.com',
						to: that.studentEmailId, //that2.studentEmailId
						subject: Subject,
						html: that.mailContent
					};

					transporter.sendMail(mailOptions, function (error, info) {
						if (error) {
							console.log(error);
							if (error.code === "EAUTH") {
								res.status(500).send('Username and Password not accepted, Please try again.');
							} else {
								res.status(500).send('Internal Error while Sending the email, Please try again.');
							}
						} else {
							console.log('Email sent: ' + info.response);
							res.send("email sent");
						}
					});
				});

			});

		app.post('/sendInquiryEmail',
			async function (req, res) {
				//https://developers.google.com/oauthplayground/
				//https://cloud.google.com/iam/docs/reference/credentials/rest/v1/projects.serviceAccounts/generateAccessToken
				//
				var nodemailer = require('nodemailer');
				var smtpTransport = require('nodemailer-smtp-transport');
				const xoauth2 = require('xoauth2');
				// const key = require('./samples.json');
				var array = ["user", "clientId", "clientSecret", "refreshToken"];
				var Param = app.models.Param;
				var key = {};
				var sParam = await Param.find({
					where: {
						and: [{
							Code: {
								inq: array
							}

						}]
					}
				}).then();
				for (let index = 0; index < sParam.length; index++) {
					const element = sParam[index].__data;
					if (element.Code === "user") {
						key.user = element.Value;
					}
					if (element.Code === "clientId") {
						key.clientId = element.Value;
					}
					if (element.Code === "clientSecret") {
						key.clientSecret = element.Value;
					}
					if (element.Code === "refreshToken") {
						key.refreshToken = element.Value;
					}
				}
				const fs = require('fs');
				// console.log(req.body);
				var transporter = nodemailer.createTransport(smtpTransport({
					service: 'gmail',
					host: 'smtp.gmail.com',
					auth: {
						xoauth2: xoauth2.createXOAuth2Generator({
							user: key.user,
							clientId: key.clientId,
							clientSecret: key.clientSecret,
							refreshToken: key.refreshToken
						})
					}
				}));
				// var app = require('../server/server');
				// var CourseMst = app.models.CourseMst;

					// var Subject = req.body.Subject;
					Subject =  `${req.body.CourseName} for ${req.body.WardName} 🟢`;
					var contents = req.body.EmailTemplate.replace("$$FatherName$$",req.body.FatherName)
					.replace("$$WardName$$", req.body.WardName).replace(/\$\$CourseName\$\$/gi, req.body.CourseName)
					.replace(/\$\$CourseFee\$\$/gi, req.body.CourseFee);

				// var contents = fs.readFileSync(__dirname + '/sampledata/summercamp.html', 'utf-8');
				//var demoDate = new Date(data.DemoDate);
				Date.prototype.toShortFormat = function () {
					var month_names = ["Jan", "Feb", "Mar",
						"Apr", "May", "Jun",
						"Jul", "Aug", "Sep",
						"Oct", "Nov", "Dec"
					];

					var day = this.getDate();
					var month_index = this.getMonth();
					var year = this.getFullYear();

					return "" + day + "-" + month_names[month_index] + "-" + year;
				}

				var ccs = [];
				var mailOptions = {};
				mailOptions = {
					from: 'contact@evotrainingsolutions.com',
					to: req.body.EmailId, //req.body.EmailId    FirstName  CourseName
					cc: ccs,
					subject: Subject,
					html: contents
				};

				transporter.sendMail(mailOptions, function (error, info) {
					if (error) {
						console.log(error);
						if (error.code === "EAUTH") {
							res.status(500).send('Username and Password not accepted, Please try again.');
						} else {
							res.status(500).send('Internal Error while Sending the email, Please try again.');
						}
					} else {
						console.log('Email sent: ' + info.response);
						res.send("email sent");
					}
				});

			});

		mailContent: "",
			app.post('/sendSubscriptionEmail',
				function (req, res) {

					//if partial payment is true update the due amount and due values
					Date.prototype.toShortFormat = function () {
						var month_names = ["Jan", "Feb", "Mar",
							"Apr", "May", "Jun",
							"Jul", "Aug", "Sep",
							"Oct", "Nov", "Dec"
						];

						var day = this.getDate();
						var month_index = this.getMonth();
						var year = this.getFullYear();

						return "" + day + "-" + month_names[month_index] + "-" + year;
					}
					//console.log(req.body);
					var payload = req.body;
					var that = this;
					this.mailContent = fs.readFileSync(process.cwd() + "\\server\\sampledata\\" + 'payment.html', 'utf8');
					if (payload.includeX.indexOf("Renewal") !== -1) {
						this.mailContent = fs.readFileSync(process.cwd() + "\\server\\sampledata\\" + 'renewalPayment.html', 'utf8');
						var x = new Date(payload.EndDate);
						this.mailContent = this.mailContent.replace("$$DueDate$$", x.toShortFormat());
					}
					if (payload.PartialPayment === "true") {

						var x = new Date(payload.PaymentDueDate);
						this.mailContent = this.mailContent.replace("$$DueDate$$", x.toShortFormat());
						this.mailContent = this.mailContent.replace("$$DueAmount$$", payload.PendingAmount);
					} else {
						//else : remove the line
						this.mailContent = this.mailContent.replace("<p>Please note that your next payment is due on $$DueDate$$ with amount $$DueAmount$$ INR.</p>", "");
					}

					var app = require('../server/server');
					var Student = app.models.Student;
					this.StudentId = req.body.StudentId;
					this.CourseId = req.body.CourseId;
					this.password = payload.password;
					this.includeX = payload.includeX;
					this.giveAccess = payload.giveAccess;
					Student.findById(this.StudentId).then(function (singleStu) {
						var app = require('../server/server');
						var Course = app.models.Course;
						var that2 = that;
						that.studentEmailId = singleStu.GmailId;
						that.studentName = singleStu.Name.split(" ")[0];
						Course.findById(that.CourseId).then(function (courseStr) {
							console.log(that2.studentEmailId + "," + that2.studentName);
							console.log(courseStr);
							console.log(that2.mailContent);
							if (courseStr.Name === "ABAP" ||
								courseStr.Name === "OOPS ABAP" ||
								courseStr.Name === "Webdynpro" ||
								courseStr.Name === "Workflow" ||
								courseStr.Name === "FPM" ||
								courseStr.Name === "BRF" ||
								courseStr.Name === "Adobe Forms") {
								that2.mailContent = fs.readFileSync(process.cwd() + "\\server\\sampledata\\" + 'otherPayment.html', 'utf8');;
								that2.mailContent = that2.mailContent.replace("$$MLink$$", '<a href="' + courseStr.DriveId + '">' + courseStr.DriveId + '</a>');
							}

							///Replace the link in the contents
							that2.mailContent = that2.mailContent.replace("$$Link$$", '<a href="' + courseStr.Link + '">' + courseStr.Link + '</a>');
							that2.studentName = that2.studentName.replace(/([A-Z])/g, " $1");
							that2.studentName = that2.studentName.charAt(0).toUpperCase() + that2.studentName.slice(1);
							var endDate = new Date(courseStr.EndDate);
							var abhi = new Date();
							if (abhi > endDate) {
								that2.isCalRequire = false;
								//delete line for calendar invite
								that2.mailContent = that2.mailContent.replace("<p>Additionally, google <a href=\"http://calendar.google.com\">calendar invite</a> is also sent to your email id.", "").replace("<em>Please note that, We have given you access of latest content (on going batch), So more videos will come as we progress with regular classes.</em>", "");
								that2.mailContent = that2.mailContent.replace("<p>Additionally, google <a href='http://calendar.google.com'>calendar invite</a> is also sent to your email id. <em>Please note that it is an ongoing LIVE batch hence more videos will be added to the blog as and when course progress. You can cover the available videos and by that time you will get new videos</em>.</p>", "");
							} else {
								that2.isCalRequire = true;
							}
							var nodemailer = require('nodemailer');
							var smtpTransport = require('nodemailer-smtp-transport');
							var transporter = nodemailer.createTransport(smtpTransport({
								service: 'gmail',
								host: 'smtp.gmail.com',
								auth: {
									user: 'onlinefioritrainings@gmail.com',
									pass: that2.password
								}
							}));
							var Subject = "[Welcome Onboard] " + courseStr.Name + " Training Subscription";
							//https://myaccount.google.com/lesssecureapps?pli=1
							that2.mailContent = that2.mailContent.replace('$$Name$$', that2.studentName)
							var ccs = ["anubhav.abap@gmail.com"];
							if (that2.includeX === "true" || that2.includeX === "Renewal-true") {
								ccs.push("install.abap@gmail.com");
							} else if (that2.includeX === "Renewal") {
								//change content of the email here - anu
							}
							var mailOptions = {
								from: 'onlinefioritrainings@gmail.com',
								to: that2.studentEmailId, //that2.studentEmailId
								cc: ccs,
								subject: Subject,
								html: that2.mailContent
							};

							transporter.sendMail(mailOptions, function (error, info) {
								if (error) {
									console.log(error);
									if (error.code === "EAUTH") {
										res.status(500).send('Username and Password not accepted, Please try again.');
									} else {
										res.status(500).send('Internal Error while Sending the email, Please try again.');
									}
								} else {
									console.log('Email sent: ' + info.response);
									res.send("email sent");
								}
							});

						});
					});




				});

		app.post("/clearToken", function (req, res) {

			const sampleClient = require('../google/sampleclient');
			sampleClient.clearToken();
			res.send("Success");

		});
		app.post('/giveAccess',
			function (req, res) {
				var app = require('../server/server');
				var Student = app.models.Student;
				this.StudentId = req.body.StudentId;
				this.CourseId = req.body.CourseId;
				var that = this;
				Student.findById(this.StudentId).then(function (singleStu) {
					var app = require('../server/server');
					var Course = app.models.Course;
					var that2 = that;
					that.studentEmailId = singleStu.GmailId;
					that.studentName = singleStu.Name.split(" ")[0];
					Course.findById(that.CourseId).then(function (courseStr) {
						console.log(that2.studentEmailId + "," + that2.studentName);
						console.log(courseStr);
						console.log(that2.mailContent);
						var endDate = new Date(courseStr.EndDate);
						var abhi = new Date();
						if (abhi > endDate) {
							that2.isCalRequire = false;
						} else {
							that2.isCalRequire = true;
						}
						const {
							google
						} = require('googleapis');
						const sampleClient = require('../google/sampleclient');

						const drive = google.drive({
							version: 'v3',
							auth: sampleClient.oAuth2Client,
						});

						
						if (that2.isCalRequire === true &&
							(courseStr.CalendarId != "null" && courseStr.CalendarId != "" &&
								courseStr.EventId != "null" && courseStr.EventId != "")
						) {
							const calendar = google.calendar({
								version: 'v3',
								auth: sampleClient.oAuth2Client,
							});
							that2.CalendarId = courseStr.CalendarId;
							that2.EventId = courseStr.EventId;
							that2.calendar = calendar;
						}

						that2.DriveId = courseStr.DriveId;

						var that3 = that2;

						async function runSample(query) {
							drive.permissions.create({
								fileId: that3.DriveId,
								sendNotificationEmail: false,
								resource: {
									role: 'reader',
									type: 'user',
									emailAddress: that3.studentEmailId,
								}
							}, (error, permissionResponse) => {
								if (error) {
									console.log(error);
								} else {
									res.send("drive access granted");
								}
							});

							if (that2.isCalRequire === true &&
								(courseStr.CalendarId != "null" && courseStr.CalendarId != "" &&
									courseStr.EventId != "null" && courseStr.EventId != "")) {
								that2.calendar.events.get({
									calendarId: that2.CalendarId + 'roup.calendar.google.com',
									eventId: that2.EventId
								}, function (err, something) {
									if (err) {
										console.log("CALENDAR NOT FOUND");
										res.send("calendar not found");
										return;
									}
									something.data.attendees.push({
										"email": that3.studentEmailId
									});
									that3.calendar.events.patch({
										calendarId: that3.CalendarId + 'roup.calendar.google.com',
										eventId: that3.EventId,
										resource: {
											attendees: something.data.attendees,
											recurrence: something.data.recurrence,
											end: something.data.end,
											start: something.data.start
										}
									}, function (err, something) {
										if (err) {
											console.error(err);
										} else {
											res.send("calendar access granted");
										}
									});
								});
							}
						}
						if (module === require.main) {
							const scopes = [
								'https://www.googleapis.com/auth/drive',
								'https://www.googleapis.com/auth/calendar.events'
							];
							sampleClient
								.authenticate(scopes)
								.then(runSample)
								.catch(console.error);
						}
					});
				});
			});


		app.post('/updateAllInq',
			function (req, res) {
				var Course = app.models.Course;
				Course.updateAll({}, {
					"CalendarId": "null",
					"DriveId": "null",
					"EventId": ""
				}, function () {
					console.log("done");
				});

			});

		app.post('/gtest',
			function (req, res) {
				const {
					google
				} = require('googleapis');
				const sampleClient = require('../google/sampleclient');

				const drive = google.drive({
					version: 'v3',
					auth: sampleClient.oAuth2Client,
				});
				const calendar = google.calendar({
					version: 'v3',
					auth: sampleClient.oAuth2Client,
				});
				async function runSample(query) {
					drive.permissions.create({
						fileId: '1fqDCnW01Say3JmRkCRFw1flUpYmp_xlj',
						sendNotificationEmail: false,
						resource: {
							role: 'reader',
							type: 'user',
							emailAddress: 'deepakoftcom@gmail.com',
						}
					}, (error, permissionResponse) => {
						if (error) {
							console.log(error);
						} else {
							console.log(permissionResponse);
						}
					});
					var that = this;
					this.calId = "20ldbaatoi4sb59gaunjk609pk@group.calendar.google.com";
					this.eveId = "2fag90e6fp9mk3gv07bceuq0rl";
					this.calendar = calendar;
					this.calendar.events.get({
						calendarId: this.calId,
						eventId: this.eveId
					}, function (err, something) {
						something.data.attendees.push({
							"email": "deepakoftcom@gmail.com"
						});
						that.calendar.events.patch({
							calendarId: that.calId,
							eventId: that.eveId,
							resource: {
								attendees: something.data.attendees,
								recurrence: something.data.recurrence,
								end: something.data.end,
								start: something.data.start
							}
						}, function (err, something) {
							if (err) {
								console.error(err);
							} else {
								console.log(something);
							}
						});
					});
				}
				if (module === require.main) {
					const scopes = [
						'https://www.googleapis.com/auth/calendar',
						'https://www.googleapis.com/auth/drive',
						'https://www.googleapis.com/auth/calendar.events'
					];
					sampleClient
						.authenticate(scopes)
						.then(runSample)
						.catch(console.error);
				}

				module.exports = {
					runSample,
					client: sampleClient.oAuth2Client,
				};
			});

		app.post('/updateBalanceInAccount', function (req, res) {
			var payload = req.body;
			var that = this;
			this.accountNo = req.body.AccountNo;
			this.amount = req.body.Amount;
			var app = require('../server/server');
			var AccountBalance = app.models.AccountBalance;
			AccountBalance.findOne({
				where: {
					and: [{
						Remarks: "AUTOSERVERBALANCE"
					}, {
						AccountNo: this.accountNo
					}]
				}
			})
				.then(function (record) {
					
					var app = require('../server/server');
					var AccountBalance = app.models.AccountBalance;
					if (record) {
						var id = record.id;
						var updateObj = {
							Amount: parseInt(record.Amount) + parseInt(that.amount),
							CreatedOn: new Date()
						};
						AccountBalance.findById(id).then(function (instance) {
							return instance.updateAttributes(updateObj);
						});
					} else {
						var newRec = {};
						newRec.CreatedOn = new Date();
						newRec.AccountNo = that.accountNo;
						newRec.Remarks = "AUTOSERVERBALANCE";
						newRec.Amount = that.amount;
						AccountBalance.findOrCreate({
							where: {
								Remarks: "AUTOSERVERBALANCE",
								AccountNo: this.accountNo
							}
						}, newRec)
							.then(function (inq) {
								
								console.log("created successfully");
							})
							.catch(function (err) {
								console.log(err);
							});
					}
				}
				);


		});
		app.post('/upload',
			function (req, res) {

				if (!req.files.myFileUpload) {
					res.send('No files were uploaded.');
					return;
				}

				var sampleFile;
				var exceltojson;

				sampleFile = req.files.myFileUpload;

				sampleFile.mv('./uploads/' + req.files.myFileUpload.name, function (err) {
					if (err) {
						console.log("eror saving");
					} else {
						console.log("saved");
						if (req.files.myFileUpload.name.split('.')[req.files.myFileUpload.name.split('.').length - 1] === 'xlsx') {
							exceltojson = xlsxtojson;
							console.log("xlxs");
						} else {
							exceltojson = xlstojson;
							console.log("xls");
						}
						try {
							exceltojson({
								input: './uploads/' + req.files.myFileUpload.name,
								output: null, //since we don't need output.json
								lowerCaseHeaders: true
							}, function (err, result) {
								if (err) {
									return res.json({
										error_code: 1,
										err_desc: err,
										data: null
									});
								}
								res.json({
									error_code: 0,
									err_desc: null,
									data: result
								});

								var getMyDate = function (strDate) {
									var qdat = new Date();
									var x = strDate;
									qdat.setYear(parseInt(x.substr(0, 4)));
									qdat.setMonth(parseInt(x.substr(4, 2)) - 1);
									qdat.setDate(parseInt(x.substr(6, 2)));
									return qdat;
								};
								var Inquiry = app.models.Inquiry;
								var Student = app.models.Student;
								var Batch = app.models.Course;
								var Account = app.models.Account;
								var Subs = app.models.Sub;
								var uploadType = "Server";
								///*****Code to update the batchs
								this.allResult = [];
								switch (uploadType) {
									case "Email":
										for (var j = 0; j < result.length; j++) {
											this.allResult[result[j].email] = result[j];
										}
										break;
									case "Server":
										for (var j = 0; j < result.length; j++) {
											this.allResult[result[j].email] = result[j];
										}
										break;
									default:

								}

								///Process the result json and send to mongo for creating all inquiries
								for (var j = 0; j < result.length; j++) {
									var singleRec = result[j];

									switch (uploadType) {
										case "Check":
											var GmailId = singleRec.email;
											Student.find({
												where: {
													GmailId: singleRec.email
												}
											})
												.then(function (stu) {
													if (stu.length > 0) {
														
														console.log(stu[0].GmailId + " found");
													}
												});
											break;
										case "Server":
											var GmailId = singleRec.email;
											Student.findOne({
												where: {
													GmailId: singleRec.email
												}
											})
												.then(function (stu) {
													if (stu) {
														var app = require('../server/server');
														var Student = app.models.Student;
														var Server = app.models.Server;
														var newRecord = {};
														
														newRecord.CreatedOn = getMyDate("20180101");
														newRecord.CreatedBy = "5c187035dba2681834ffe301";
														newRecord.ChangedOn = getMyDate("20180101");
														newRecord.ChangedBy = "5c187035dba2681834ffe301";
														newRecord.User = this.allResult[stu.GmailId].mobuser.toUpperCase();
														newRecord.StudentId = stu.id;
														newRecord.PaymentDate = getMyDate(this.allResult[stu.GmailId].paydate);
														newRecord.StartDate = getMyDate(this.allResult[stu.GmailId].startdate);
														newRecord.EndDate = getMyDate(this.allResult[stu.GmailId].enddate);
														newRecord.UserEndDate = getMyDate(this.allResult[stu.GmailId].userenddate);
														newRecord.Amount = this.allResult[stu.GmailId].amount;
														newRecord.Mode = "Online";
														newRecord.PassRDP = this.allResult[stu.GmailId].password;
														newRecord.Remarks = "Created by Anubhav";
														newRecord.Extr1 = this.allResult[stu.GmailId].email
														Server.findOrCreate({
															"where": {
																"and": [{
																	"StudentId": newRecord.StudentId
																},
																{
																	"User": newRecord.User
																}
																]
															}
														}, newRecord)
															.then(function (batch) {
																console.log("created server successfully");
															})
															.catch(function (err) {
																console.log(err);
															});
													}
												})
												.catch(function (err) {
													console.log(err);
												});
											break;
										case "Email":
											this.newRec = {};
											this.newRec.GmailId = singleRec.email;
											this.newRec.OtherEmail1 = singleRec.email1;
											this.newRec.OtherEmail2 = singleRec.email2;
											var GmailId = singleRec.email;
											var that = this;
											Student.findOne({
												where: {
													GmailId: singleRec.email
												}
											})
												.then(function (stu) {
													if (stu) {
														
														var app = require('../server/server');
														var Student = app.models.Student;
														var id = stu.id;
														console.log(this.allResult[stu.GmailId]);
														stu.OtherEmail1 = this.allResult[stu.GmailId].email1;
														stu.OtherEmail2 = this.allResult[stu.GmailId].email2;
														var updateObj = {
															OtherEmail1: this.allResult[stu.GmailId].email1,
															OtherEmail2: this.allResult[stu.GmailId].email2
														};
														Student.findById(id).then(function (instance) {
															return instance.updateAttributes(updateObj);
														});
														//Student.update(stu);
														// stu.updateAttributes({
														//   OtherEmail1: this.allResult[stu.GmailId].OtherEmail1,
														//   OtherEmail2: this.allResult[stu.GmailId].OtherEmail2
														// });
														// console.log("update successfully");
													}
												})
												.catch(function (err) {
													console.log(err);
												});
											///*****End of code to update batches
											break;
										case "Account":
											var newRec = {};
											newRec.accountName = singleRec.accountname;
											newRec.ifsc = singleRec.ifsc;
											newRec.accountNo = singleRec.accountno;
											newRec.limit = singleRec.limit;
											newRec.white = singleRec.white;
											newRec.userId = singleRec.userid;
											newRec.registeredNo = singleRec.mobile;
											newRec.email = "null";
											newRec.counter = 0;
											newRec.current = false;
											Account.findOrCreate({
												where: {
													accountNo: newRec.accountNo
												}
											}, newRec)
												.then(function (inq) {
													
													console.log("created successfully");
												})
												.catch(function (err) {
													console.log(err);
												});
											///*****End of code to update batches
											break;
										case "Batch":
											var newRec = {};
											newRec.CreatedOn = getMyDate(singleRec.startdate);
											newRec.CreatedBy = "5c187035dba2681834ffe301";
											newRec.ChangedOn = getMyDate(singleRec.startdate);
											newRec.ChangedBy = "5c187035dba2681834ffe301";
											newRec.Extra = "null";
											newRec.Extra1 = "null";
											newRec.Name = singleRec.name;
											newRec.BatchNo = singleRec.batchno;
											newRec.StartDate = getMyDate(singleRec.startdate);
											newRec.DemoStartDate = getMyDate(singleRec.startdate);
											newRec.EndDate = getMyDate(singleRec.enddate);
											newRec.ReminderDate = getMyDate(singleRec.reminderdate);
											newRec.BlogEndDate = getMyDate(singleRec.blogenddate);
											newRec.Link = singleRec.link;
											newRec.Weekend = singleRec.weekend;
											newRec.Timings = singleRec.timings;
											newRec.Fee = singleRec.fee;

											Batch.findOrCreate({
												where: {
													BatchNo: newRec.BatchNo
												}
											}, newRec)
												.then(function (inq) {
													
													console.log("created successfully");
												})
												.catch(function (err) {
													console.log(err);
												});
											///*****End of code to update batches
											break;
										case "Inquiry":
											if (singleRec.pending) {
												if (singleRec.pending !== "") {
													continue;
												}
											}
											/////****Code to update Inquiries one by one file and also created
											///cusromer based on TRUE flag
											newRec.EmailId = singleRec.emailid.toLowerCase();
											newRec.CourseName = singleRec.coursename;
											newRec.FirstName = singleRec.firstname;
											newRec.LastName = singleRec.lastname;
											newRec.Country = singleRec.country;
											newRec.Date = getMyDate(singleRec.date);
											newRec.Subject = singleRec.coursename;
											newRec.Message = singleRec.coursename;
											newRec.SoftDelete = singleRec.softdelete;
											newRec.Phone = singleRec.phone;
											singleRec.Date = getMyDate(singleRec.Date);
											Inquiry.findOrCreate({
												where: {
													and: [{
														EmailId: newRec.EmailId
													}, {
														CourseName: newRec.CourseName
													}]
												}
											}, newRec)
												.then(function (inq) {
													
													console.log("created successfully");
												})
												.catch(function (err) {
													console.log(err);
												});
											newRec.EmailId = singleRec.emailid.toLowerCase();
											newRec.CourseName = singleRec.coursename;
											newRec.FirstName = singleRec.firstname;
											newRec.LastName = singleRec.lastname;
											newRec.Country = singleRec.country;
											newRec.Date = getMyDate(singleRec.date);
											newRec.Subject = singleRec.coursename;
											newRec.Message = singleRec.coursename;
											newRec.SoftDelete = singleRec.softdelete;
											newRec.Phone = singleRec.phone;

											Inquiry.findOrCreate({
												where: {
													and: [{
														EmailId: newRec.EmailId
													}, {
														CourseName: newRec.CourseName
													}]
												}
											}, newRec)
												.then(function (inq) {
													
													console.log("created successfully");
												})
												.catch(function (err) {
													console.log(err);
												});

											if (newRec.SoftDelete === "TRUE") {
												var studentRec = {};
												studentRec.CreatedOn = getMyDate(singleRec.date);
												studentRec.CreatedBy = "5c187035dba2681834ffe301";
												studentRec.ChangedOn = getMyDate(singleRec.date);
												studentRec.ChangedBy = "5c187035dba2681834ffe301";
												studentRec.GmailId = singleRec.emailid.toLowerCase();
												studentRec.Name = singleRec.firstname + " " + singleRec.lastname;
												studentRec.CompanyMail = "null";
												studentRec.OtherEmail1 = "null";
												studentRec.OtherEmail2 = "null";
												studentRec.ContactNo = singleRec.phone;
												studentRec.Country = singleRec.country;
												studentRec.Designation = "null";
												studentRec.Star = false;
												studentRec.Defaulter = false;
												studentRec.HighServerUsage = false;
												studentRec.Skills = singleRec.coursename;
												studentRec.Resume = "null";
												studentRec.Extra1 = "null";
												studentRec.Extra2 = "null";
												Student.findOrCreate({
													where: {
														and: [{
															GmailId: newRec.EmailId
														}]
													}
												}, studentRec)
													.then(function (inq) {
														
														console.log("Student also created successfully");
													})
													.catch(function (err) {
														console.log(err);
													});
											}
											////****end of changes
											break;
										case "Students":
											var Batchs = Batch;
											singleRec.studentid = singleRec.studentid.toLowerCase();

											///****create student rather lookups
											var studentEmail = singleRec.studentid.toLowerCase();
											var courseFee = singleRec.amount;
											var remarker = "";
											if (singleRec.remarks) {
												remarker = singleRec.remarks;
											}

											Batchs.findOne({
												"where": {
													"BatchNo": singleRec.courseid
												}
											})
												.then(function (batch) {
													var batchid = batch.id;
													var newRec = {};
													newRec.StartDate = batch.StartDate;
													newRec.EndDate = batch.EndDate;
													newRec.PaymentDate = batch.StartDate;
													newRec.PaymentDueDate = batch.EndDate;
													newRec.CourseId = batch.id;
													newRec.Mode = "L";
													newRec.PaymentMode = "IMPS";
													newRec.BankName = "null";
													newRec.AccountName = "null";
													newRec.Amount = courseFee;
													newRec.Reference = "null";
													newRec.Remarks = "Auto Created ";
													if (remarker === "X") {
														newRec.Remarks = "Again WebIDE02: Auto Created ";
													}
													newRec.PendingAmount = 0;
													newRec.Waiver = false;
													newRec.DropOut = false;
													newRec.PaymentScreenshot = "null";
													newRec.PartialPayment = false;
													newRec.Extended = false;
													newRec.Extra1 = "null";
													newRec.Extra2 = "null";
													newRec.ExtraN1 = 0;
													newRec.ExtraN2 = 0;
													newRec.ExtraN3 = 0;
													newRec.UpdatePayment = false;
													newRec.MostRecent = true
													newRec.CreatedBy = "5c187035dba2681834ffe301";
													newRec.ChangedBy = "5c187035dba2681834ffe301";
													//newRec.StudentId = studentsx;
													newRec.CourseId = batchid;

													var studentRec = {};
													studentRec.CreatedOn = batch.StartDate;
													studentRec.CreatedBy = "5c187035dba2681834ffe301";
													studentRec.ChangedOn = batch.StartDate;
													studentRec.ChangedBy = "5c187035dba2681834ffe301";
													studentRec.GmailId = studentEmail;
													studentRec.Name = "Auto CreatedSub";
													studentRec.CompanyMail = "null";
													studentRec.OtherEmail1 = "null";
													studentRec.OtherEmail2 = "null";
													studentRec.ContactNo = 0;
													studentRec.Country = "IN";
													studentRec.Designation = "null";
													studentRec.Star = false;
													studentRec.Defaulter = false;
													studentRec.HighServerUsage = false;
													studentRec.Skills = batch.Name;
													studentRec.Resume = "null";
													studentRec.Extra1 = "null";
													studentRec.Extra2 = "null";
													var finalSub = newRec;
													Student.findOrCreate({
														where: {
															and: [{
																GmailId: studentEmail
															}]
														}
													}, studentRec)
														.then(function (inq) {
															
															console.log("Student also created successfully");
														})
														.catch(function (err) {
															console.log(err);
														});
													// Student.findOrCreate({where: {and: [{GmailId: studentEmail}]}},studentRec)
													//   .then(function (student) {
													//     finalSub.StudentId = student[0].id;
													//     var studentsx = student[0].id;
													//     var studentsemail = student[0].GmailId;
													//     console.log('batch id ', batchid, 'student email ', studentsemail,
													//                 'studentid', studentsx );
													//   })
													//   .catch(function(err){
													//     console.log(err);
													//   });


												})
												.catch(function (err) {
													console.log(err);
												});
											break;
										case "Subscription":
											var Batchs = Batch;
											singleRec.studentid = singleRec.studentid.toLowerCase();
											var gmailId = singleRec.studentid.toLowerCase();
											var studentRec = {};
											studentRec.CreatedOn = getMyDate("20180101");
											studentRec.CreatedBy = "5c187035dba2681834ffe301";
											studentRec.ChangedOn = getMyDate("20180101");
											studentRec.ChangedBy = "5c187035dba2681834ffe301";
											studentRec.GmailId = singleRec.studentid.toLowerCase();
											studentRec.Name = "Auto CreatedSub";
											studentRec.CompanyMail = "null";
											studentRec.OtherEmail1 = "null";
											studentRec.OtherEmail2 = "null";
											studentRec.ContactNo = 0;
											studentRec.Country = "IN";
											studentRec.Designation = "null";
											studentRec.Star = false;
											studentRec.Defaulter = false;
											studentRec.HighServerUsage = false;
											studentRec.Skills = "null";
											studentRec.Resume = "null";
											studentRec.Extra1 = "null";
											studentRec.Extra2 = "null";
											if (!gmailId) {
												console.log("gmail id blank @ ", j.toString());
												continue;
											}
											Student.findOrCreate({
												where: {
													and: [{
														GmailId: gmailId
													}]
												}
											}, studentRec)
												.then(function (student) {
													if (student[0].GmailId) {
														var students = student[0].id;
														var studentsemail = student[0].GmailId.toLowerCase();
													}

													var singleRec1 = singleRec;
													var Sub = Subs;
													Batchs.findOne({
														"where": {
															"BatchNo": singleRec1.courseid
														}
													})
														.then(function (batch) {
															var batchid = batch.id;
															var newRec = {};
															newRec.StartDate = batch.StartDate;
															newRec.EndDate = batch.EndDate;
															newRec.PaymentDate = batch.StartDate;
															newRec.PaymentDueDate = batch.EndDate;
															newRec.StudentId = students.id;
															newRec.CourseId = batch.id;

															newRec.Mode = "L";
															newRec.PaymentMode = "IMPS";
															newRec.BankName = "null";
															newRec.AccountName = "null";
															newRec.Amount = singleRec.amount;
															newRec.Reference = "null";
															newRec.Remarks = "Auto Created ";
															if (singleRec1.remarks) {
																if (singleRec1.remarks === "X") {
																	newRec.Remarks = "Again WebIDE02: Auto Created ";
																}
															}
															newRec.PendingAmount = 0;
															newRec.Waiver = false;
															newRec.DropOut = singleRec.dropout;
															newRec.PaymentScreenshot = "null";
															newRec.PartialPayment = false;
															newRec.Extended = false;
															newRec.Extra1 = "null";
															newRec.Extra2 = "null";
															newRec.ExtraN1 = 0;
															newRec.ExtraN2 = 0;
															newRec.ExtraN3 = 0;
															newRec.UpdatePayment = false;
															newRec.MostRecent = true
															newRec.CreatedBy = "5c187035dba2681834ffe301";
															newRec.ChangedBy = "5c187035dba2681834ffe301";
															var studentsx = students;
															console.log('batch id ', batchid, 'student email ', studentsemail,
																'studentid', studentsx);
															newRec.StudentId = studentsx;
															newRec.CourseId = batchid;
															
															Sub.findOrCreate({
																"where": {
																	"and": [{
																		"CourseId": batchid
																	},
																	{
																		"StudentId": studentsx
																	}
																	]
																}
															}, newRec)
																.then(function (batch) {
																	console.log("created subscription successfully");
																})
																.catch(function (err) {
																	console.log(err);
																});

														})
														.catch(function (err) {
															console.log(err);
														});
												}).catch(function (err) {
													console.log(err);
												});
											break;

									}
								}

							});
						} catch (e) {
							console.log("error");
							res.json({
								error_code: 1,
								err_desc: "Corupted excel file"
							});
						}

					}
				})
			}
		);



	});
};


// Bootstrap the application, configure models, datasources and middleware.
// Sub-apps like REST API are mounted via boot scripts.
boot(app, __dirname, function (err) {
	if (err) throw err;

	// start the server if `$ node server.js`
	if (require.main === module)
		app.start();
});
