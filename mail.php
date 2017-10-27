<?php



if(isset($_POST['the_name'])){
    $name =$_POST['the_name'];
    $email =$_POST['the_email'];
    $feedback =$_POST['the_feedback'];




    $to = 'razorflashmedia@gmail.com';
    $subject = 'Received Feedback';
    $message = '';
    $message.= '<p><strong>Name:</strong></p><p>'.$name.'</p>';
    $message.= '<p><strong>Email:</strong></p><p>'.$email.'</p>';
    $message.= '<p><strong>Feedback:</strong></p><p>'.$feedback.'</p>';
    $headers  = 'MIME-Version: 1.0' . "\r\n";
    $headers .= 'Content-type: text/html; charset=iso-8859-1' . "\r\n";
    $headers.= 'From: '. $email . "\r\n" .
        'Reply-To: '. $email  . "\r\n" .
        'X-Mailer: PHP/' . phpversion();
    mail($to, $subject, $message, $headers);

//    print_r($_POST);
}


