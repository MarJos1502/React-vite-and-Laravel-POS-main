<?php

namespace App\Http\Controllers;

use App\Models\Survey;
use Illuminate\Http\Request;

class SurveyController extends Controller
{
    public function store(Request $request)
    {
        $validated = $request->validate([
            'payment_id' => 'required|exists:payments,id',
            'rating' => 'required|integer|min:1|max:5',
            'comment' => 'nullable|string',
        ]);
        $survey = Survey::create($validated);
        return response()->json($survey, 201);
    }

    public function analytics()
    {
        // Pie chart: count of each rating (1-5)
        $labels = ["Excellent", "Good", "Average", "Fair", "Poor"];
        $ratingMap = [5 => 0, 4 => 1, 3 => 2, 2 => 3, 1 => 4];
        $counts = [0, 0, 0, 0, 0];
        foreach (\App\Models\Survey::all() as $survey) {
            if (isset($ratingMap[$survey->rating])) {
                $counts[$ratingMap[$survey->rating]]++;
            }
        }
        $ratingsData = [
            'labels' => $labels,
            'datasets' => [[
                'label' => 'Customer Ratings',
                'data' => $counts,
                'backgroundColor' => ["#28a745", "#17a2b8", "#ffc107", "#fd7e14", "#dc3545"],
            ]],
        ];

        // Line chart: average rating per week (last 4 weeks)
        $weeks = [];
        $trend = [];
        for ($i = 3; $i >= 0; $i--) {
            $start = now()->startOfWeek()->subWeeks($i);
            $end = now()->startOfWeek()->subWeeks($i - 1);
            $weekSurveys = \App\Models\Survey::whereBetween('created_at', [$start, $end])->get();
            $weeks[] = 'Week ' . (4 - $i);
            $trend[] = $weekSurveys->count() ? round($weekSurveys->avg('rating') * 20, 2) : null;
        }
        $satisfactionTrend = [
            'labels' => $weeks,
            'datasets' => [[
                'label' => 'Satisfaction (%)',
                'data' => $trend,
                'borderColor' => '#007bff',
                'backgroundColor' => 'rgba(0,123,255,0.2)',
                'tension' => 0.4,
                'fill' => true,
                'pointRadius' => 5,
            ]],
        ];

        return response()->json([
            'ratingsData' => $ratingsData,
            'satisfactionTrend' => $satisfactionTrend,
        ]);
    }
}
