<?php
include 'db.php';

if($_SERVER['REQUEST_METHOD'] == "POST") {
    $first = mysqli_real_escape_string($connect, $_POST['first']);
    $second = mysqli_real_escape_string($connect, $_POST['second']);
    
    $s = mysqli_query($connect, "SELECT * FROM breeding WHERE parent_1_id='".$first."' AND parent_2_id='".$second."'");
    if(mysqli_num_rows($s) > 0){
        $m = mysqli_fetch_array($s);
        $result['status'] = 'success';
        $result['img'] = 'img/'.$m['result_name'].'.png';
        $result['msg'] = 'You will get '.$m['result_name'];
    }else{
        $result['msg'] = 'Breeding Combinations Not Found';
	    $result['code'] = '101';
    }
} else {
    $result['msg'] = 'Unknown request';
	$result['code'] = '101';
}

echo json_encode($result);