<?php
$connect = mysqli_connect('localhost','root','passs','db');
if(!$connect) die('died.');
header('Access-Control-Allow-Origin: *');
date_default_timezone_set("Asia/Jakarta");
function shot_db($tab, $sequence='') {
	global $connect;
	$array = array();
	$query = mysqli_query($connect, "SELECT * FROM ".$tab." WHERE ".$sequence);
	$count = mysqli_num_rows($query);
	$array['count'] = $count;
	if($count == 1) {
		$array['data'] = mysqli_fetch_array($query);
	} else {
		while($row = mysqli_fetch_assoc($query)) {
			$array['data'][]=$row;
		}
	}
	return $array;
}

function update($tab, $data, $sequence = '') {
	global $connect;
	$query = mysqli_query($connect, "UPDATE ".$tab." SET ".$data." WHERE ".$sequence);
	return true;
}
function getPals($username){
	global $connect;
	$all = shot_db('pal', "name!='Google' ORDER by name ASC");
	if($all['count'] > 0){
		return $all;
	}else{
		return $r['data']['no'] = 'none';
	}
}
function getBreedCombs($id){
	global $connect;
	$all = shot_db('breeding', "result_id=$id");
	if($all['count'] > 0){
		return $all;
	}else{
		return $r['data']['no'] = 'none';
	}
}
