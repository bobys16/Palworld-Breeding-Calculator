<?php

include 'db.php';

if($_SERVER['REQUEST_METHOD'] == "POST") {
	$token = $_POST['id'];

	if($token !== '007') {
		$result['msg'] = 'Sesi kadaluarsa! Mohon masuk kembali..';
		$result['code'] = '300';
	} else {
	    $m = mysqli_fetch_array(mysqli_query($connect, "SELECT * FROM pal ORDER by count DESC LIMIT 1"));
	    $t = mysqli_fetch_array(mysqli_query($connect, "SELECT SUM(count) as total FROM pal"));
		$result['status'] = 'success';
		$result['msg'] = 'Refreshed!';
		$result['code'] = '200';
		$result['userdata']['most_result']  = $m['name'];
		$result['userdata']['search_total'] = $t['total'];
		$result['pal'] = getPals(123);
	}
	
} else {
	$result['msg'] = 'Unknown request';
	$result['code'] = '101';
}
echo json_encode($result);

