import 'package:flutter/material.dart';
import 'package:provider/provider.dart';
import '../providers/app_provider.dart';

class SearchFilterBar extends StatelessWidget {
  const SearchFilterBar({super.key});

  @override
  Widget build(BuildContext context) {
    return Container(
      padding: const EdgeInsets.all(16),
      decoration: BoxDecoration(
        color: Theme.of(context).cardColor,
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.05),
            blurRadius: 10,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: Consumer<AppProvider>(
        builder: (context, provider, child) {
          return Column(
            children: [
              TextField(
                onChanged: provider.setSearchQuery,
                decoration: InputDecoration(
                  hintText: 'Search students by name, roll number, or email...',
                  prefixIcon: const Icon(Icons.search),
                  suffixIcon: provider.searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.clear),
                          onPressed: () => provider.setSearchQuery(''),
                        )
                      : null,
                  border: OutlineInputBorder(
                    borderRadius: BorderRadius.circular(15),
                    borderSide: BorderSide.none,
                  ),
                  filled: true,
                  fillColor: Theme.of(context).brightness == Brightness.dark
                      ? Colors.grey.shade800
                      : Colors.grey.shade100,
                  contentPadding: const EdgeInsets.symmetric(horizontal: 20, vertical: 16),
                ),
              ),
              if (provider.searchQuery.isNotEmpty || provider.filterDepartment != 'All')
                Padding(
                  padding: const EdgeInsets.only(top: 12),
                  child: Row(
                    children: [
                      if (provider.searchQuery.isNotEmpty)
                        Chip(
                          label: Text('Search: "${provider.searchQuery}"'),
                          onDeleted: () => provider.setSearchQuery(''),
                          deleteIcon: const Icon(Icons.close, size: 18),
                        ),
                      if (provider.filterDepartment != 'All')
                        Padding(
                          padding: const EdgeInsets.only(left: 8),
                          child: Chip(
                            label: Text('Dept: ${provider.filterDepartment}'),
                            onDeleted: () => provider.setFilterDepartment('All'),
                            deleteIcon: const Icon(Icons.close, size: 18),
                          ),
                        ),
                      const Spacer(),
                      TextButton.icon(
                        onPressed: () {
                          provider.setSearchQuery('');
                          provider.setFilterDepartment('All');
                        },
                        icon: const Icon(Icons.clear_all),
                        label: const Text('Clear All'),
                      ),
                    ],
                  ),
                ),
            ],
          );
        },
      ),
    );
  }
}
