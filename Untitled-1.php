
			<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "hh24@4@H";
$dbname = "hccweb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to count records where BATCH = 2024 and degree = UG
$sqlUG = "SELECT COUNT(*) AS total FROM yr_x_2024_stud_ugxx_mast WHERE BATCH = 2024 AND degree = 'UG'";

// Execute query for UG students
$resultUG = $conn->query($sqlUG);

// Check if the query was successful and fetch the count for UG
$totalCountUG = 0;
if ($resultUG->num_rows > 0) {
    $rowUG = $resultUG->fetch_assoc();
    $totalCountUG = $rowUG['total'];
} else {
    $totalCountUG = 0;
}

// SQL query to count records where BATCH = 2024 and degree = PG
$sqlPG = "SELECT COUNT(*) AS total FROM yr_x_2024_stud_ugxx_mast WHERE BATCH = 2024 AND degree = 'PG'";

// Execute query for PG students
$resultPG = $conn->query($sqlPG);

// Check if the query was successful and fetch the count for PG
$totalCountPG = 0;
if ($resultPG->num_rows > 0) {
    $rowPG = $resultPG->fetch_assoc();
    $totalCountPG = $rowPG['total'];
} else {
    $totalCountPG = 0;
}

// Close the connection
$conn->close();
?>

<div class="row">
    <!-- Left Section (Total UG Students for 2024 Batch) -->
    <div class="col-lg-6 col-md-12 col-sm-12">
        <div>
            <section class="mt-3">
                <div class="btn btn-block table-one text-light d-flex">
                    <span class="font-weight-bold"><i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Total I-UG Students (2024 Batch)</span>
                    <a href="" class="ml-auto" data-toggle="collapse" data-target="#collapseOne"><i class="fa fa-plus text-light" aria-hidden="true"></i></a>
                </div>
                <div class="collapse show mt-2" id="collapseOne">
                    <table class="w-100 table-elements table-one-tr" cellpadding="2">
                        <tr class="pt-5 table-one text-white" style="height: 32px;">
                            <th>Total Count</th>
                        </tr>
                        <tr>
                            <td style="font-size: 28px; font-weight: bold;"><?php echo $totalCountUG; ?></td>
                        </tr>
                    </table>
                </div>
            </section>
        </div>
    </div>

    <!-- Right Section (Total PG Students for 2024 Batch) -->
    <div class="col-lg-6 col-md-12 col-sm-12">
        <div>
            <section class="mt-3">
                <div class="btn btn-block table-two text-light d-flex">
                    <span class="font-weight-bold"><i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Total I-PG Students (2024 Batch)</span>
                    <a href="" class="ml-auto" data-toggle="collapse" data-target="#collapseTwo"><i class="fa fa-plus text-light" aria-hidden="true"></i></a>
                </div>
                <div class="collapse show mt-2" id="collapseTwo">
                    <table class="w-100 table-elements table-two-tr" cellpadding="2">
                        <tr class="pt-5 table-two text-white" style="height: 32px;">
                            <th>Total Count</th>
                        </tr>
                        <tr>
                            <td style="font-size: 28px; font-weight: bold;"><?php echo $totalCountPG; ?></td>
                        </tr>
                    </table>
                </div>
            </section>
        </div>
    </div>
</div>







			



<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "hh24@4@H";
$dbname = "hccweb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to count records where BATCH = 2024 and degree = UG
$sqlUG = "SELECT COUNT(*) AS total FROM yr_x_2023_stud_ugxx_mast WHERE BATCH = 2023 AND degree = 'UG'";

// Execute query for UG students
$resultUG = $conn->query($sqlUG);

// Check if the query was successful and fetch the count for UG
$totalCountUG = 0;
if ($resultUG->num_rows > 0) {
    $rowUG = $resultUG->fetch_assoc();
    $totalCountUG = $rowUG['total'];
} else {
    $totalCountUG = 0;
}

// SQL query to count records where BATCH = 2024 and degree = PG
$sqlPG = "SELECT COUNT(*) AS total FROM yr_x_2023_stud_ugxx_mast WHERE BATCH = 2023 AND degree = 'PG'";

// Execute query for PG students
$resultPG = $conn->query($sqlPG);

// Check if the query was successful and fetch the count for PG
$totalCountPG = 0;
if ($resultPG->num_rows > 0) {
    $rowPG = $resultPG->fetch_assoc();
    $totalCountPG = $rowPG['total'];
} else {
    $totalCountPG = 0;
}

// Close the connection
$conn->close();
?>

<div class="row">
    <!-- Left Section (Total UG Students for 2024 Batch) -->
    <div class="col-lg-6 col-md-12 col-sm-12">
        <div>
            <section class="mt-3">
                <div class="btn btn-block table-one text-light d-flex">
                    <span class="font-weight-bold"><i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Total II-UG Students (2023 Batch)</span>
                    <a href="" class="ml-auto" data-toggle="collapse" data-target="#collapseOne"><i class="fa fa-plus text-light" aria-hidden="true"></i></a>
                </div>
                <div class="collapse show mt-2" id="collapseOne">
                    <table class="w-100 table-elements table-one-tr" cellpadding="2">
                        <tr class="pt-5 table-one text-white" style="height: 32px;">
                            <th>Total Count</th>
                        </tr>
                        <tr>
                            <td style="font-size: 28px; font-weight: bold;"><?php echo $totalCountUG; ?></td>
                        </tr>
                    </table>
                </div>
            </section>
        </div>
    </div>

    <!-- Right Section (Total PG Students for 2024 Batch) -->
    <div class="col-lg-6 col-md-12 col-sm-12">
        <div>
            <section class="mt-3">
                <div class="btn btn-block table-two text-light d-flex">
                    <span class="font-weight-bold"><i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Total II-PG Students (2023 Batch)</span>
                    <a href="" class="ml-auto" data-toggle="collapse" data-target="#collapseTwo"><i class="fa fa-plus text-light" aria-hidden="true"></i></a>
                </div>
                <div class="collapse show mt-2" id="collapseTwo">
                    <table class="w-100 table-elements table-two-tr" cellpadding="2">
                        <tr class="pt-5 table-two text-white" style="height: 32px;">
                            <th>Total Count</th>
                        </tr>
                        <tr>
                            <td style="font-size: 28px; font-weight: bold;"><?php echo $totalCountPG; ?></td>
                        </tr>
                    </table>
                </div>
            </section>
        </div>
    </div>
</div>






<?php
// Database connection
$servername = "localhost";
$username = "root";
$password = "hh24@4@H";
$dbname = "hccweb";

// Create connection
$conn = new mysqli($servername, $username, $password, $dbname);

// Check connection
if ($conn->connect_error) {
    die("Connection failed: " . $conn->connect_error);
}

// SQL query to count records where BATCH = 2024 and degree = UG
$sqlUG = "SELECT COUNT(*) AS total FROM yr_x_2022_stud_ugxx_mast WHERE BATCH = 2022 AND degree = 'UG'";

// Execute query for UG students
$resultUG = $conn->query($sqlUG);

// Check if the query was successful and fetch the count for UG
$totalCountUG = 0;
if ($resultUG->num_rows > 0) {
    $rowUG = $resultUG->fetch_assoc();
    $totalCountUG = $rowUG['total'];
} else {
    $totalCountUG = 0;
}

// SQL query to count records where BATCH = 2024 and degree = PG
$sqlPG = "SELECT COUNT(*) AS total FROM yr_x_2024_stud_ugxx_mast WHERE BATCH = 2022 AND degree = 'PG'";

// Execute query for PG students
$resultPG = $conn->query($sqlPG);

// Check if the query was successful and fetch the count for PG
$totalCountPG = 0;
if ($resultPG->num_rows > 0) {
    $rowPG = $resultPG->fetch_assoc();
    $totalCountPG = $rowPG['total'];
} else {
    $totalCountPG = 0;
}

// Close the connection
$conn->close();
?>

<div class="row">
    <!-- Left Section (Total UG Students for 2024 Batch) -->
    <div class="col-lg-6 col-md-12 col-sm-12">
        <div>
            <section class="mt-3">
                <div class="btn btn-block table-one text-light d-flex">
                    <span class="font-weight-bold"><i class="fa fa-clock-o mr-2" aria-hidden="true"></i> Total III- UG Students (2022 Batch)</span>
                    <a href="" class="ml-auto" data-toggle="collapse" data-target="#collapseOne"><i class="fa fa-plus text-light" aria-hidden="true"></i></a>
                </div>
                <div class="collapse show mt-2" id="collapseOne">
                    <table class="w-100 table-elements table-one-tr" cellpadding="2">
                        <tr class="pt-5 table-one text-white" style="height: 32px;">
                            <th>Total Count</th>
                        </tr>
                        <tr>
                            <td style="font-size: 28px; font-weight: bold;"><?php echo $totalCountUG; ?></td>
                        </tr>
                    </table>
                </div>
            </section>
        </div>
    </div>

    <!-- Right Section (Total PG Students for 2024 Batch) -->
   
</div>