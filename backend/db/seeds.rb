# This file should contain all the record creation needed to seed the database with its default values.
# The data can then be loaded with the rake db:seed (or created alongside the db with db:setup).
#
# Examples:
#
#   cities = City.create([{ name: 'Chicago' }, { name: 'Copenhagen' }])
#   Mayor.create(name: 'Emanuel', city: cities.first)

role = Role.create(name: "User")

admin_role = Role.create(name: "Admin")

tag = Tag.create(name: "Redpoint")

user = User.create(name: "Kalle Anka", password: "password", email: "kalle@anka.se")

report = Report.create(route_grade: "5c", route_name: "Lätta Leden")

location = Location.create(name: "Nice mountain", latitude: 50, longitude: 49)

key = Key.create(app_name: "Fantastic App", key_value: "abcd1234")


# Add associations
user.roles << admin_role

location.report << report

report.tags << tag

user.report << report

user.key << key
