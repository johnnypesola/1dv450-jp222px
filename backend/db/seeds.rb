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

user = User.create(name: "Administrator", password: "password", email: "admin@admin.se")

clientuser = Clientuser.create(provider: "github", uid: "8630408", name: "Johnny Pesola", token: "cb594f81cb486d3e007e8ad4f7007b2463619c97", auth_token: "5AVAnJMtVLezkf6MKidFrw", token_expires: "2016-01-01 12:00:00")

report = Report.create(route_grade: "5c", route_name: "Lätta Leden")

location = Location.create(name: "Nice mountain", latitude: 50, longitude: 49)

key = Key.create(app_name: "Fantastic App", key_value: "abcd1234")


# Add associations
user.roles << admin_role

location.report << report

report.tags << tag

clientuser.report << report

user.key << key
