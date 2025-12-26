# MongoDB Database Commands for Fix-It Hub

## Quick Access Commands

### 1. **View All Users**
```bash
mongosh fixithub --eval "db.users.find().pretty()"
```

### 2. **View All Listings**
```bash
mongosh fixithub --eval "db.listings.find().pretty()"
```

### 3. **Count Documents**
```bash
# Count users
mongosh fixithub --eval "db.users.countDocuments()"

# Count listings
mongosh fixithub --eval "db.listings.countDocuments()"
```

### 4. **Find Specific User by Email**
```bash
mongosh fixithub --eval "db.users.findOne({email: 'alice@college.edu'})"
```

### 5. **Find Open Listings**
```bash
mongosh fixithub --eval "db.listings.find({status: 'open'}).pretty()"
```

### 6. **Find Listings by Category**
```bash
mongosh fixithub --eval "db.listings.find({category: 'Tech'}).pretty()"
```

## Interactive MongoDB Shell

To open an interactive MongoDB shell:
```bash
mongosh fixithub
```

Once inside the shell, you can run:
```javascript
// Show all collections
show collections

// View users
db.users.find()

// View listings with populated postedBy
db.listings.find().populate('postedBy')

// Find user by ID
db.users.findOne({_id: ObjectId('YOUR_ID_HERE')})

// Update a user
db.users.updateOne(
  {email: 'alice@college.edu'},
  {$set: {bio: 'Updated bio!'}}
)

// Delete a listing
db.listings.deleteOne({_id: ObjectId('YOUR_ID_HERE')})

// Clear all data (careful!)
db.users.deleteMany({})
db.listings.deleteMany({})

// Exit the shell
exit
```

## Using MongoDB Compass (GUI Tool)

If you want a visual interface:

1. **Install MongoDB Compass** (if not already installed):
```bash
# For Ubuntu/Debian
wget https://downloads.mongodb.com/compass/mongodb-compass_1.42.0_amd64.deb
sudo dpkg -i mongodb-compass_1.42.0_amd64.deb
```

2. **Connect to Database**:
   - Open MongoDB Compass
   - Connection string: `mongodb://localhost:27017`
   - Database name: `fixithub`

## Useful Queries

### Find users with specific skills
```bash
mongosh fixithub --eval "db.users.find({skills: 'Basic Soldering'}).pretty()"
```

### Find listings posted by a specific user
```bash
mongosh fixithub --eval "db.listings.find({postedBy: ObjectId('694e7ec0d1309530595a61fe')}).pretty()"
```

### Count listings by category
```bash
mongosh fixithub --eval "db.listings.aggregate([{$group: {_id: '$category', count: {$sum: 1}}}])"
```

### Find users with highest ratings
```bash
mongosh fixithub --eval "db.users.find().sort({rating: -1}).limit(5).pretty()"
```

## Reset Database (Re-run Seeder)

To reset the database with fresh seed data:
```bash
cd server
node seeder.js
```

## Check Database Status
```bash
# Check if MongoDB is running
systemctl status mongod

# Check database size
mongosh fixithub --eval "db.stats()"
```

## Test Login Credentials

From the seeded data, you can test login with:
- Email: `alice@college.edu` / Password: `password123`
- Email: `sarah.chen@college.edu` / Password: `password123`
- Email: `mike.r@college.edu` / Password: `password123`

**Note**: The passwords are hashed in production, but these are the plain text passwords before hashing!
