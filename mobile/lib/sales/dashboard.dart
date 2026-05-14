import 'package:flutter/material.dart';

class SalesDashboard extends StatelessWidget {
  const SalesDashboard({Key? key}) : super(key: key);

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: const Color(0xFF121212), // Deep dark background
      appBar: AppBar(
        backgroundColor: const Color(0xFF181818),
        title: const Text(
          'Nezam Sales',
          style: TextStyle(color: Color(0xFF1DB954), fontWeight: FontWeight.bold),
        ),
        actions: [
          IconButton(
            icon: const Icon(Icons.notifications, color: Colors.white),
            onPressed: () {},
          ),
          const CircleAvatar(
            backgroundColor: Color(0xFF282828),
            child: Icon(Icons.person, color: Colors.white),
          ),
          const SizedBox(width: 10),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(16.0),
        child: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            // Standing Card
            _buildStandingCard(),
            const SizedBox(height: 20),
            
            // Quick Actions
            const Text(
              'Quick Actions',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _buildQuickActions(),
            const SizedBox(height: 20),
            
            // Recent Reservations
            const Text(
              'Recent Reservations',
              style: TextStyle(color: Colors.white, fontSize: 18, fontWeight: FontWeight.bold),
            ),
            const SizedBox(height: 10),
            _buildRecentReservations(),
          ],
        ),
      ),
      bottomNavigationBar: _buildBottomNav(),
    );
  }

  Widget _buildStandingCard() {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: const Color(0xFF181818),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Text(
            'Your Standing: #3 on Leaderboard',
            style: TextStyle(color: Color(0xFFB3B3B3), fontSize: 14),
          ),
          const SizedBox(height: 10),
          Container(
            padding: const EdgeInsets.all(12.0),
            decoration: BoxDecoration(
              color: const Color(0xFF282828),
              borderRadius: BorderRadius.circular(4.0),
            ),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: const [
                Text(
                  'Today\'s Sales:',
                  style: TextStyle(color: Colors.white, fontSize: 16),
                ),
                Text(
                  '\$1,200',
                  style: TextStyle(color: Color(0xFF1DB954), fontSize: 20, fontWeight: FontWeight.bold),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickActions() {
    return Row(
      children: [
        Expanded(
          child: _buildActionButton(Icons.add, 'New Book'),
        ),
        const SizedBox(width: 16),
        Expanded(
          child: _buildActionButton(Icons.table_chart, 'View Map'),
        ),
      ],
    );
  }

  Widget _buildActionButton(IconData icon, String label) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 16.0),
      decoration: BoxDecoration(
        color: const Color(0xFF1DB954),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.center,
        children: [
          Icon(icon, color: Colors.black),
          const SizedBox(width: 8),
          Text(
            label,
            style: const TextStyle(color: Colors.black, fontWeight: FontWeight.bold),
          ),
        ],
      ),
    );
  }

  Widget _buildRecentReservations() {
    return Column(
      children: [
        _buildReservationItem('Ahmed', 'Table 4 (VIP)', 'Confirmed'),
        const SizedBox(height: 10),
        _buildReservationItem('Sara', 'Table 12', 'Pending'),
      ],
    );
  }

  Widget _buildReservationItem(String name, String table, String status) {
    return Container(
      padding: const EdgeInsets.all(16.0),
      decoration: BoxDecoration(
        color: const Color(0xFF181818),
        borderRadius: BorderRadius.circular(8.0),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(name, style: const TextStyle(color: Colors.white, fontSize: 16, fontWeight: FontWeight.bold)),
              Text(table, style: const TextStyle(color: Color(0xFFB3B3B3), fontSize: 14)),
            ],
          ),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
            decoration: BoxDecoration(
              color: status == 'Confirmed' ? const Color(0xFF1DB954).withOpacity(0.2) : Colors.orange.withOpacity(0.2),
              borderRadius: BorderRadius.circular(500),
            ),
            child: Text(
              status,
              style: TextStyle(
                color: status == 'Confirmed' ? const Color(0xFF1DB954) : Colors.orange,
                fontSize: 12,
                fontWeight: FontWeight.bold
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildBottomNav() {
    return BottomNavigationBar(
      backgroundColor: const Color(0xFF181818),
      selectedItemColor: const Color(0xFF1DB954),
      unselectedItemColor: const Color(0xFFB3B3B3),
      currentIndex: 0,
      items: const [
        BottomNavigationBarItem(icon: Icon(Icons.home), label: 'Home'),
        BottomNavigationBarItem(icon: Icon(Icons.book), label: 'Books'),
        BottomNavigationBarItem(icon: Icon(Icons.people), label: 'CRM'),
      ],
    );
  }
}
