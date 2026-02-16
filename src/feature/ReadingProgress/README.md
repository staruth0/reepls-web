# Reading Progress Implementation

This implementation follows the sophisticated reading progress formula provided by the boss, which combines temporal engagement (time spent) and spatial engagement (scroll position) to create a fair and balanced estimate of reading progress.

## Formula

The reading progress is calculated using:

```
RP = (α × min(Rt, Rs)) + ((1-α) × max(Rt, Rs))
```

Where:
- **Rt** = Time Ratio = Time Spent / Article Read Time
- **Rs** = Scroll Ratio = Current Scroll Position / Maximum Scroll Position  
- **α** = Weight Min = 0.7 (penalizes skimming or leaving page idle)
- **(1-α)** = Weight Max = 0.3

## Key Features

### 1. **Fair Progress Calculation**
- Prevents overestimation from rapid skimming (high scroll, low time)
- Prevents overestimation from leaving tab open (high time, low scroll)
- Gives more weight to the lower of the two ratios

### 2. **Boundary Protection**
- Caps time spent at article read time to prevent infinity bugs
- Caps scroll position at maximum scroll position
- Handles edge cases (zero article time, zero scroll, etc.)

### 3. **Real-time Tracking**
- Tracks time spent reading in real-time
- Tracks scroll position with throttling for performance
- Updates progress calculation continuously

### 4. **Visual Feedback**
- Progress bar showing overall reading progress
- Detailed breakdown of time and scroll ratios
- Status indicators for time/scroll limits

## Files Structure

```
src/
├── utils/
│   └── readingProgressCalculator.ts    # Core calculation logic
├── hooks/
│   └── useReadingProgress.tsx          # React hook for tracking
├── components/
│   ├── atoms/
│   │   └── ReadingProgressBar.tsx      # Visual progress indicator
│   └── molecules/
│       └── ReadingProgressDemo.tsx     # Demo component
├── feature/
│   └── ReadingProgress/
│       ├── api/                        # API calls
│       ├── hooks/                      # React Query hooks
│       └── types/                      # TypeScript types
└── Tests/
    └── readingProgress.test.ts         # Unit tests
```

## Usage

### Basic Usage
```tsx
import { useReadingProgress } from '../hooks/useReadingProgress';

const { progress, isTracking, startTracking, stopTracking } = useReadingProgress({
  articleId: 'article-123',
  content: 'Article content...',
  isLoggedIn: true,
  isPreview: false
});
```

### Progress Calculation
```tsx
import { calculateReadingProgress } from '../utils/readingProgressCalculator';

const progress = calculateReadingProgress({
  timeSpent: 50,           // seconds
  articleReadTime: 240,    // seconds
  currentScrollPosition: 30, // pixels
  maxScrollPosition: 60,   // pixels
  weightMin: 0.7
});
```

## Example Calculation

Given:
- Article Read Time = 240 seconds
- Time Spent = 50 seconds  
- Current Scroll Position = 30 pixels
- Maximum Scroll Position = 60 pixels
- Weight Min (α) = 0.7

Calculations:
- Rt = 50/240 = 0.208
- Rs = 30/60 = 0.5
- min(Rt, Rs) = 0.208
- max(Rt, Rs) = 0.5
- RP = (0.7 × 0.208) + (0.3 × 0.5) = 0.1456 + 0.15 = 0.2956
- **Result: 29.56% complete**

## Benefits

1. **Accurate Progress**: Combines both time and scroll metrics for realistic progress
2. **Anti-Gaming**: Prevents users from gaming the system by rapid scrolling or leaving tabs open
3. **Performance**: Throttled scroll events and efficient calculations
4. **User Experience**: Visual feedback and detailed progress information
5. **Robust**: Handles edge cases and prevents calculation errors

## Testing

Run the unit tests to validate the calculation:

```bash
npm test readingProgress.test.ts
```

Or use the demo component to interactively test different scenarios:

```tsx
import ReadingProgressDemo from '../components/molecules/ReadingProgressDemo';

<ReadingProgressDemo />
```
