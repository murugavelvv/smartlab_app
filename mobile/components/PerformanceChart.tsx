import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

interface ChartData {
  label: string;
  value: number;
}

interface PerformanceChartProps {
  data: ChartData[];
}

export default function PerformanceChart({ data }: PerformanceChartProps) {
  const maxValue = Math.max(...data.map(d => d.value), 100);

  return (
    <View style={styles.container}>
      {data.map((item, index) => (
        <View key={index} style={styles.barContainer}>
          <Text style={styles.label}>{item.label}</Text>
          <View style={styles.barBackground}>
            <View
              style={[
                styles.bar,
                {
                  width: `${(item.value / maxValue) * 100}%`,
                  backgroundColor: getBarColor(item.value),
                }
              ]}
            />
          </View>
          <Text style={styles.value}>{item.value}%</Text>
        </View>
      ))}
    </View>
  );
}

function getBarColor(value: number): string {
  if (value >= 90) return '#10B981';
  if (value >= 80) return '#3B82F6';
  if (value >= 70) return '#F59E0B';
  return '#EF4444';
}

const styles = StyleSheet.create({
  container: {
    gap: 16,
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    width: 80,
  },
  barBackground: {
    flex: 1,
    height: 8,
    backgroundColor: '#F3F4F6',
    borderRadius: 4,
    overflow: 'hidden',
  },
  bar: {
    height: '100%',
    borderRadius: 4,
  },
  value: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    width: 40,
    textAlign: 'right',
  },
});