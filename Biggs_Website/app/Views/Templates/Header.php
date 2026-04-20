<?php
$title = $title ?? 'Biggs Website';
$bodyClass = $bodyClass ?? 'min-h-screen bg-slate-50 text-slate-900 md:pl-[290px]';
?>
<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="UTF-8">
	<meta name="viewport" content="width=device-width, initial-scale=1.0">
	<meta name="description" content="Biggs reusable CodeIgniter 4 layout with Tailwind CSS">
	<title><?= esc($title) ?></title>

    
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jquery/3.7.1/jquery.min.js"></script>
	<script src="https://cdn.tailwindcss.com"></script>
	<script>
		tailwind.config = {
			theme: {
				extend: {
					colors: {
						brand: {
							50: '#fef2f2',
							100: '#fee2e2',
							500: '#ef4444',
							600: '#dc2626',
							700: '#b91c1c'
						}
					}
				}
			}
		};
	</script>
</head>
<body class="<?= esc($bodyClass) ?>">
<div class="min-h-screen flex flex-col">
