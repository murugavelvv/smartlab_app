import 'package:flutter/material.dart';
import '../utils/theme.dart';

class EnhancedStatCard extends StatelessWidget {
  final String title;
  final String value;
  final IconData icon;
  final Color color;
  final bool useGradient;
  final String? subtitle;
  final VoidCallback? onTap;
  final bool showTrend;
  final double? trendValue;
  final bool isPositive;

  const EnhancedStatCard({
    super.key,
    required this.title,
    required this.value,
    required this.icon,
    required this.color,
    this.useGradient = false,
    this.subtitle,
    this.onTap,
    this.showTrend = false,
    this.trendValue,
    this.isPositive = true,
  });

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 8,
      shadowColor: color.withValues(alpha: 0.3),
      shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(20)),
      child: InkWell(
        onTap: onTap,
        borderRadius: BorderRadius.circular(20),
        child: Container(
          decoration: BoxDecoration(
            borderRadius: BorderRadius.circular(20),
            gradient: useGradient
                ? LinearGradient(
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                    colors: [
                      color.withValues(alpha: 0.1),
                      color.withValues(alpha: 0.05),
                    ],
                  )
                : null,
          ),
          padding: const EdgeInsets.all(16), // Reduced padding from 20 to 16
          child: Flexible(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              mainAxisSize: MainAxisSize.min, // Added to prevent overflow
              children: [
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10), // Reduced from 12 to 10
                      decoration: BoxDecoration(
                        color: color.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(10), // Reduced from 12 to 10
                      ),
                      child: Icon(
                        icon,
                        color: color,
                        size: 22, // Reduced from 24 to 22
                      ),
                    ),
                    if (showTrend && trendValue != null)
                      Container(
                        padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                        decoration: BoxDecoration(
                          color: (isPositive ? AppTheme.successColor : AppTheme.errorColor).withValues(alpha: 0.2),
                          borderRadius: BorderRadius.circular(8),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            Icon(
                              isPositive ? Icons.trending_up : Icons.trending_down,
                              size: 16,
                              color: isPositive ? AppTheme.successColor : AppTheme.errorColor,
                            ),
                            const SizedBox(width: 4),
                            Text(
                              '${trendValue!.toStringAsFixed(1)}%',
                              style: TextStyle(
                                fontSize: 12,
                                fontWeight: FontWeight.bold,
                                color: isPositive ? AppTheme.successColor : AppTheme.errorColor,
                              ),
                            ),
                          ],
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 12), // Reduced from 16 to 12
                Text(
                  value,
                  style: TextStyle(
                    fontSize: 24, // Reduced from 28 to 24
                    fontWeight: FontWeight.bold,
                    color: color,
                  ),
                  overflow: TextOverflow.ellipsis, // Added to prevent text overflow
                  maxLines: 1, // Added to limit text to single line
                ),
                const SizedBox(height: 3), // Reduced from 4 to 3
                Text(
                  title,
                  style: TextStyle(
                    fontSize: 13, // Reduced from 14 to 13
                    color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.7),
                    fontWeight: FontWeight.w500,
                  ),
                  overflow: TextOverflow.ellipsis, // Added to prevent text overflow
                  maxLines: 1, // Added to limit text to single line
                ),
                if (subtitle != null) ...[
                  const SizedBox(height: 3), // Reduced from 4 to 3
                  Text(
                    subtitle!,
                    style: TextStyle(
                      fontSize: 11, // Reduced from 12 to 11
                      color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.5),
                    ),
                    overflow: TextOverflow.ellipsis, // Added to prevent text overflow
                    maxLines: 1, // Added to limit text to single line
                  ),
                ],
              ],
            ),
          ),
        ),
      ),
    );
  }
}

class MetricCard extends StatelessWidget {
  final String label;
  final String value;
  final IconData icon;
  final Color color;
  final String? unit;
  final double? percentage;

  const MetricCard({
    super.key,
    required this.label,
    required this.value,
    required this.icon,
    required this.color,
    this.unit,
    this.percentage,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: color.withValues(alpha: 0.1),
        borderRadius: BorderRadius.circular(12),
        border: Border.all(
          color: color.withValues(alpha: 0.2),
          width: 1,
        ),
      ),
      child: Column(
        children: [
          Icon(
            icon,
            color: color,
            size: 24,
          ),
          const SizedBox(height: 8),
          Text(
            value,
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: color,
            ),
          ),
          if (unit != null) ...[
            Text(
              unit!,
              style: TextStyle(
                fontSize: 12,
                color: color.withValues(alpha: 0.7),
              ),
            ),
          ],
          const SizedBox(height: 4),
          Text(
            label,
            style: TextStyle(
              fontSize: 12,
              color: Theme.of(context).textTheme.bodyMedium?.color?.withValues(alpha: 0.7),
            ),
            textAlign: TextAlign.center,
          ),
          if (percentage != null) ...[
            const SizedBox(height: 8),
            LinearProgressIndicator(
              value: percentage! / 100,
              backgroundColor: color.withValues(alpha: 0.2),
              valueColor: AlwaysStoppedAnimation<Color>(color),
            ),
            const SizedBox(height: 4),
            Text(
              '${percentage!.toStringAsFixed(1)}%',
              style: TextStyle(
                fontSize: 10,
                color: color,
                fontWeight: FontWeight.w500,
              ),
            ),
          ],
        ],
      ),
    );
  }
}
