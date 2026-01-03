# import psycopg2
# from datetime import datetime, timedelta

# # PostgreSQL connection details
# DB_CONFIG = {
#     "host": "localhost",
#     "port": 5434,
#     "dbname": "tcoas",
#     "user": "postgres",
#     "password": "Periodicals24!"
# }

# opportunities = [
#     (1, "Infrastructure Development Consultant - Road Network Expansion",
#      "Seeking experienced consultants for major road infrastructure project covering 500km of highway development in rural areas.",
#      "Urgent", 10),

#     (2, "Financial Advisory Services for Agriculture Development Bank",
#      "Request for proposals for comprehensive financial advisory services to support agricultural financing initiatives.",
#      "Urgent", 7),

#     (3, "IT Systems Integration - National Health Insurance",
#      "Large-scale IT integration project for modernizing health insurance claim processing systems nationwide.",
#      "Active", 5),

#     (4, "Environmental Impact Assessment - Coastal Development",
#      "Expert consultants needed for environmental assessment of coastal zone development project.",
#      "ClosingToday", 14),

#     (5, "Water Supply System Upgrade - Northern Region",
#      "Design and supervision of water supply infrastructure improvements serving 100,000 residents.",
#      "Active", 3),

#     (6, "Energy Sector Reform - Policy Advisory",
#      "International consultants for energy sector policy development and regulatory framework design.",
#      "Active", 6),

#     (7, "Education Infrastructure - School Construction Program",
#      "Construction and project management services for 50 primary schools across three regions.",
#      "Active", 2),

#     (8, "Digital Payment Platform Implementation",
#      "Technology consultancy for national digital payment infrastructure development.",
#      "Urgent", 8),

#     (9, "Hospital Equipment Procurement",
#      "Supply and installation of medical equipment for regional hospitals.",
#      "Active", 12),

#     (10, "Urban Transport Feasibility Study",
#      "Consultancy to assess feasibility and planning for urban mass transport system.",
#      "New", 9),

#     (11, "Renewable Energy Installation - Solar Parks",
#      "Development of solar parks with 50MW capacity across multiple regions.",
#      "In Progress", 11),

#     (12, "Telecom Network Expansion",
#      "Expansion of mobile and broadband infrastructure in underserved rural communities.",
#      "Active", 4),

#     (13, "Waste Management System Upgrade",
#      "Design and implementation of integrated waste management systems for municipalities.",
#      "New", 13),

#     (14, "Flood Control and Drainage Project",
#      "Engineering consultancy for flood prevention and drainage improvement in urban areas.",
#      "Urgent", 6),

#     (15, "ICT Training and Capacity Building",
#      "Provision of ICT training programs for public sector employees to enhance digital skills.",
#      "Active", 5),
# ]

# def seed_opportunities():
#     conn = psycopg2.connect(**DB_CONFIG)
#     cur = conn.cursor()

#     for opp in opportunities:
#         opportunity_id, title, description, status, days_ago = opp
#         created_at = datetime.now() - timedelta(days=days_ago)

#         cur.execute(
#             """
#             INSERT INTO opportunities 
#             (opportunity_id, name, description, status, created_at, updated_at)
#             VALUES (%s, %s, %s, %s, %s, %s)
#             ON CONFLICT (opportunity_id) DO NOTHING
#             """,
#             (
#                 opportunity_id,
#                 title,
#                 description,
#                 status,
#                 created_at,
#                 created_at
#             )
#         )

#     conn.commit()
#     cur.close()
#     conn.close()
#     print("✅ Sample opportunities inserted successfully")

# if __name__ == "__main__":
#     seed_opportunities()






import psycopg2
from datetime import datetime, timedelta

# PostgreSQL connection details
DB_CONFIG = {
    "host": "localhost",
    "port": 5434,
    "dbname": "tcoas",
    "user": "postgres",
    "password": "Periodicals24!"
}

# Sample opportunities with all required fields
opportunities = [
    (1, "Infrastructure Development Consultant - Road Network Expansion",
     "Seeking experienced consultants for major road infrastructure project covering 500km of highway development in rural areas.",
     "Urgent", 10, "PPA", "EOI", "https://ppa.gov.gh/opportunity/1"),

    (2, "Financial Advisory Services for Agriculture Development Bank",
     "Request for proposals for comprehensive financial advisory services to support agricultural financing initiatives.",
     "Urgent", 7, "AfDB", "RFP", "https://afdb.org/opportunity/2"),

    (3, "IT Systems Integration - National Health Insurance",
     "Large-scale IT integration project for modernizing health insurance claim processing systems nationwide.",
     "Active", 5, "World Bank", "Tender", "https://worldbank.org/opportunity/3"),

    (4, "Environmental Impact Assessment - Coastal Development",
     "Expert consultants needed for environmental assessment of coastal zone development project.",
     "ClosingToday", 14, "Other", "RFP", "https://example.com/opportunity/4"),

    # Add remaining opportunities similarly...
]

def seed_opportunities():
    conn = psycopg2.connect(**DB_CONFIG)
    cur = conn.cursor()

    for opp in opportunities:
        opportunity_id, title, description, status, days_ago, source, type_, link = opp
        created_at = datetime.now() - timedelta(days=days_ago)
        updated_at = created_at
        posted_date = created_at  # can adjust separately if needed
        deadline = datetime.now() + timedelta(days=(days_ago % 15) + 2)  # sample deadlines

        cur.execute(
            """
            INSERT INTO opportunities 
            (opportunity_id, title, description, status, created_at, updated_at, posted_date, deadline, source, type, link)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
            ON CONFLICT (opportunity_id) DO NOTHING
            """,
            (
                opportunity_id,
                title,
                description,
                status,
                created_at,
                updated_at,
                posted_date,
                deadline,
                source,
                type_,
                link
            )
        )

    conn.commit()
    cur.close()
    conn.close()
    print("✅ Sample opportunities inserted successfully")

if __name__ == "__main__":
    seed_opportunities()
