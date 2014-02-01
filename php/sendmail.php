<?php
$empfaenger = "mail@getflourish.com";
$betreff = "Was möchtest du heute essen?";
$from = "From: Was möchtest du heute essen? <mail@getflourish.com>";
$text = "Es ist wieder Freitag. http://localhost/~fs/whatshouldweeattoday/";

mail($empfaenger, $betreff, $text, $from);
?>
