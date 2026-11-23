param([string]$OutputPath = (Join-Path $PSScriptRoot 'erd.png'))
Add-Type -AssemblyName System.Drawing
$bitmap = New-Object System.Drawing.Bitmap 1320,760
$g = [System.Drawing.Graphics]::FromImage($bitmap)
$g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
$g.Clear([System.Drawing.Color]::FromArgb(247,249,252))
$font = New-Object System.Drawing.Font('Segoe UI', 13)
$small = New-Object System.Drawing.Font('Consolas', 11)
$heading = New-Object System.Drawing.Font('Segoe UI', 21, [System.Drawing.FontStyle]::Bold)
$titlefont = New-Object System.Drawing.Font('Segoe UI', 15, [System.Drawing.FontStyle]::Bold)
$pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(69,88,113),2)
$black=[System.Drawing.Brushes]::Black
$g.DrawString('UniLib PA3  |  PostgreSQL Data Model', $heading, $black, 30, 18)
function TableBox($x,$y,$w,$name,$rows) {
 $h=55 + 29*$rows.Count
 $rect=New-Object System.Drawing.Rectangle($x,$y,$w,$h)
 $g.FillRectangle([System.Drawing.Brushes]::White,$rect)
 $g.DrawRectangle($pen,$rect)
 $g.FillRectangle([System.Drawing.Brushes]::LightSteelBlue,$x,$y,$w,42)
 $g.DrawString($name,$titlefont,$black,$x+12,$y+7)
 $yy=$y+50
 foreach($row in $rows) {
   $g.DrawString($row,$small,$black,$x+13,$yy)
   $yy+=29
 }
}
TableBox 35 100 345 'users' @('PK id: uuid','UQ username, email','role; is_active','password_hash; timestamps')
TableBox 485 100 345 'book_titles' @('PK id: uuid','UQ isbn','title; author; category','publisher?; publication_year','is_active; timestamps')
TableBox 935 100 345 'book_copies' @('PK id: uuid','FK title_id -> book_titles','UQ barcode','shelf_location; status','condition_notes?')
TableBox 35 430 345 'loans' @('PK id: uuid','FK reader_id -> users','FK copy_id -> book_copies','checked_out_at; due_at','returned_at?; renewed_at?')
TableBox 595 430 420 'reservations' @('PK id: uuid','FK reader_id -> users','FK title_id -> book_titles','FK held_copy_id? -> copies','status; created_at','ready_at?; expires_at?','fulfilled_at?; cancelled_at?')
$g.DrawLine($pen,380,165,485,165)
$g.DrawString('1 : N', $font,$black,391,138)
$g.DrawLine($pen,830,165,935,165)
$g.DrawString('1 : N', $font,$black,840,138)
$g.DrawLine($pen,205,258,205,430)
$g.DrawString('1 : N', $font,$black,213,336)
$g.DrawLine($pen,1080,297,1080,388)
$g.DrawLine($pen,1080,388,310,388)
$g.DrawLine($pen,310,388,310,430)
$g.DrawString('copy 1 : N loans', $font,$black,835,359)
$g.DrawLine($pen,770,289,770,430)
$g.DrawString('1 : N', $font,$black,780,338)
$g.DrawLine($pen,380,230,435,230)
$g.DrawLine($pen,435,230,435,400)
$g.DrawLine($pen,435,400,595,400)
$g.DrawLine($pen,595,400,595,470)
$g.DrawString('reader 1 : N holds', $font,$black,442,372)
$g.DrawString('Partial unique indexes: active Loan / Ready Reservation / active Reader-Title', $small,$black,35,714)
$bitmap.Save($OutputPath,[System.Drawing.Imaging.ImageFormat]::Png)
$g.Dispose(); $bitmap.Dispose(); $font.Dispose(); $small.Dispose(); $heading.Dispose(); $titlefont.Dispose(); $pen.Dispose()
Write-Output "WROTE $OutputPath"