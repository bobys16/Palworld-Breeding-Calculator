<?php
include 'db.php';

if($_SERVER['REQUEST_METHOD'] == "POST") {
    $cid = mysqli_real_escape_string($connect, $_POST['pals']);
    $char = mysqli_query($connect, "SELECT * FROM pal WHERE keyp='".$cid."'");
    if(mysqli_num_rows($char) > 0){
        $fc = mysqli_fetch_assoc($char);
        $result['status'] = 'success';
        $result['breed_combo'] = getBreedCombs($cid);
        mysqli_query($connect, "UPDATE pal SET count=count+1 WHERE keyp='".$cid."'");
    }else{
    	$result['msg'] = 'Bad Credential, Please Re-Login!';
    	$result['code'] = '101';
    }
    
} else {
	$result['msg'] = 'Unknown request';
	$result['code'] = '101';
}
echo json_encode($result);
