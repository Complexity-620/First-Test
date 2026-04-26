"""
Golf Shot Accuracy Analytics
Analyzes shot accuracy from 90 yards out
"""

# Shot data from 90 yards approach shots
shots = {
    1: "20ft",
    2: "12ft",
    3: "30yds",
    4: "14ft",
    5: "8ft",
    6: "15ft",
    7: "30yds",
    8: "20yds",
    9: "8yds",
    10: "11yds",
    11: "25yds",
    12: "8yds",
    13: "35yds",
    14: "15yds"
}

def convert_to_yards(distance_str):
    """Convert distance string to yards"""
    distance_str = distance_str.strip().lower()
    
    if 'yds' in distance_str or 'yd' in distance_str:
        return float(distance_str.replace('yds', '').replace('yd', '').strip())
    elif 'ft' in distance_str:
        feet = float(distance_str.replace('ft', '').strip())
        return feet / 3  # Convert feet to yards
    else:
        return float(distance_str)

def analyze_accuracy(shots_dict, threshold_yards):
    """Calculate accuracy percentage within threshold"""
    distances = [convert_to_yards(dist) for dist in shots_dict.values()]
    accurate_shots = sum(1 for d in distances if d <= threshold_yards)
    total_shots = len(distances)
    accuracy_percent = (accurate_shots / total_shots) * 100
    
    return {
        'threshold': threshold_yards,
        'accurate_shots': accurate_shots,
        'total_shots': total_shots,
        'accuracy_percent': accuracy_percent,
        'distances': distances
    }

def main():
    print("=" * 60)
    print("GOLF SHOT ACCURACY ANALYSIS")
    print("90 Yards Approach Shots")
    print("=" * 60)
    
    # Convert all shots to yards
    distances_yards = [convert_to_yards(dist) for dist in shots.values()]
    
    # Display individual shots
    print("\nShot Breakdown:")
    print("-" * 40)
    for shot_num, distance_str in shots.items():
        distance_yards = convert_to_yards(distance_str)
        print(f"Shot {shot_num:2d}: {distance_str:8s} ({distance_yards:.2f} yards)")
    
    print("\n" + "=" * 60)
    print("PRIMARY ACCURACY THRESHOLD: 12 YARDS")
    print("=" * 60)
    
    # Main analysis at 12 yards
    main_result = analyze_accuracy(shots, 12)
    print(f"\nShots within 12 yards from flag:")
    print(f"  Accurate shots: {main_result['accurate_shots']}/{main_result['total_shots']}")
    print(f"  Accuracy: {main_result['accuracy_percent']:.1f}%")
    
    print("\n" + "=" * 60)
    print("ACCURACY AT DIFFERENT THRESHOLDS (FOR COMPARISON)")
    print("=" * 60)
    
    # Analyze at different thresholds
    thresholds = [10, 15, 20, 25, 30]  # in yards
    
    for threshold in thresholds:
        result = analyze_accuracy(shots, threshold)
        print(f"\nWithin {threshold} yards:")
        print(f"  Accurate shots: {result['accurate_shots']}/{result['total_shots']}")
        print(f"  Accuracy: {result['accuracy_percent']:.1f}%")
    
    # Statistics
    print("\n" + "=" * 60)
    print("STATISTICS")
    print("=" * 60)
    print(f"Average distance from flag: {sum(distances_yards) / len(distances_yards):.2f} yards")
    print(f"Closest shot: {min(distances_yards):.2f} yards")
    print(f"Farthest shot: {max(distances_yards):.2f} yards")
    print(f"Total shots: {len(distances_yards)}")

if __name__ == "__main__":
    main()
