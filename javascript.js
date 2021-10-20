// JavaScript Document

var originalForm;

$(document).ready(function(){
	$("#button-menu").click(testForm);
	originalForm = $("#table").html();
	$("#button-ADC").click(ADC);
	
	var is_opened = false;
	var angle = 180;
	
	$("#arrow").click(function(){
		angle += 180;
		$('#arrow').css('transform','rotate(' + angle + 'deg)');
		
		if(is_opened){
			$("#div-table").css("margin-left","0");
			//$("#arrow").css("margin-left","262px");
		}
		else{
			$("#div-table").css("margin-left","1055px");
			//$("#arrow").css("margin-left","1316px");
		}
		is_opened = !is_opened;
	})
	
	$("#div-table").css("transition","inherit");
	$("#arrow").css("transition","inherit");
	$("#arrow").click();
	setTimeout(function(){
		$("#div-table").css("transition","all 1s");
		$("#arrow").css("transition","all 1s");
	},950)
});

function testForm(){
	var checkB = document.getElementById("checkB");
	var checkR = document.getElementById("checkR");
	var checkQ = document.getElementById("checkQ");
	var div2 = document.getElementById("div2");
	var link = document.getElementById("link");
	
	if(checkB.checked == true){
		if(checkR.checked == true){
			link.href = "B_R.html";
		}
		else if(checkQ.checked == true){
			link.href = "B_Q.html";
		}
		else{
			alert("Vui lòng chọn ít nhất hai thông số");
		}
	}
	else if(checkR.checked == true){
		if(checkQ.checked == true){
			link.href = "R_Q.html";
		}
		else{
			alert("Vui lòng chọn ít nhất hai thông số");
		}
	}
	else{
		alert("Vui lòng chọn ít nhất hai thông số");
	}
}

function u(a,b){
	if((a-b) >= 0)
		return 1;
	else 
		return 0;
}

function ADC(){
	$("#table").html(originalForm);
	$("#add-table").empty();
	
	var input = document.getElementsByTagName("input");
	
	if(input[0].id == "B"){
		var B = parseFloat(document.getElementById("B").value);
		if(input[1].id == "R"){
			var R = parseFloat(document.getElementById("R").value);
			var Q = R/Math.pow(2,B);
		}
		else{
			var Q = parseFloat(document.getElementById("Q").value);
			var R = Q*Math.pow(2,B);
		}
	}
	else{
		var R = parseFloat(document.getElementById("R").value);
		var Q = parseFloat(document.getElementById("Q").value);
		var B = (Math.log2(R/Q)).toFixed(0);
		Q = R/Math.pow(2,B);
	}
	
	var x = parseFloat(document.getElementById("x").value);
	var Select1 = document.getElementById("Select1").value;
	var Select2 = document.getElementById("Select2").value;
	var result1 = 0;
	var result2 = 0;
	
	var b = new Array;
	var y = x + Q/2;
	
	for(var i = 0; i <= B-1; i++){
		b[i] = 0;
	}
	
	var x_temp;
	if(Select2 == "Làm tròn xuống"){
		x_temp = x;
	}
	else{
		x_temp = y;
	}
	if(Select1 == "ADC đơn cực"){
		for(var i = 0; i <= B-1; i++){
			var xQ = 0;
			b[i] = 1;
			for(var j = 0; j <= B-1; j++){
				xQ += b[j]*Math.pow(2,-(j+1));
			}
			xQ = R*xQ;
			b[i] = u(x_temp,xQ);
		}
	}
	else if(Select1 == "ADC lưỡng cực"){
		for(var i = 0; i <= B-1; i++){
			var xQ = 0;
			b[i] = 1;
			for(var j = 0; j <= B-1; j++){
				xQ += b[j]*Math.pow(2,-(j+1));
			}
			xQ = R*(xQ - 0.5);
			b[i] = u(x_temp,xQ);
		}
	}
	else{
		b[0] = u(x_temp,0);
		for(var i = 1; i <= B-1; i++){
			var xQ = 0;
			b[i] = 1;
			for(var j = 0; j <= B-1; j++){
				xQ += b[j]*Math.pow(2,-(j+1));
			}
			xQ = R*(xQ - 0.5);
			b[i] = u(x_temp,xQ);
		}
		b[0] = 1 - u(x_temp,0);
	}
	
	var m = 0;
	if(Select1 == "ADC bù 2"){
		m = (1 - b[0])*Math.pow(2,B-1);
		for(var i = 1; i < B; i++){
			m += b[i]*Math.pow(2,B - 1 - i);
		}	
		result1 = Q*m - R/2;
	}
	else{
		for(var i = 0; i < B; i++){
			m += b[i]*Math.pow(2,B - 1 - i);
		}
		if(Select1 == "ADC đơn cực"){
			result1 = Q*m;
		}
		else{
			result1 = Q*m - R/2;
		}
	}
	document.getElementById("result1").value = result1;
	
	result2 = b[0].toString();
	for(var i = 1;i < B;i++){
		result2 += b[i].toString();
	}
	document.getElementById("result2").value = result2;
	
	for(var i = 1; i <= Math.pow(2,B)+1; i++){
		$("#add-table").append("<tr><td></td><td></td><td></td><td></td><td></td><td></td></tr>");
	}
	
	var tr = document.getElementsByTagName("tr");
	var td = document.getElementsByTagName("td");
	for(var i = 0; i <= Math.pow(2,B); i++){
		var temp1 = (Math.pow(2,B)-i-1).toString(2);
		while(temp1.length != B){temp1 = 0 + temp1};
		$(td[15+6*i]).text(temp1);
		
		var temp2 = new Array;
		temp2[0] = 1 - temp1[0];
		for(var j = 1;j < B;j++){
			temp2 += temp1[j];
		}
		$(td[20+6*i]).text(temp2);
		
		$(td[10+6*i]).text(Math.pow(2,B)-i);
		$(td[12+6*i]).text(Math.pow(2,B)/2-i);
		
		$(td[11+6*i]).text(parseFloat((Q*$(td[10+6*i]).text())).toFixed(3));
		$(td[13+6*i]).text(parseFloat((Q*$(td[12+6*i]).text())).toFixed(3));	
	}

	for(var i = 1; i <= B; i++){
		$(td[0]).append("b<sub>"+i+"</sub>");
	}

	$(td[8]).html($(td[0]).html());
}

