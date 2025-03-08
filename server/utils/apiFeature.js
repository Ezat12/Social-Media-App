class apiFeature {
  constructor(findMongoose, queryString) {
    this.findMongoose = findMongoose;
    this.queryString = queryString;
  }
  filtering() {
    const queryObject = { ...this.queryString };

    const fieldQuery = ["limit", "skip", "fields", "sort", "keyword"];

    fieldQuery.forEach((item) => {
      delete queryObject[item];
    });

    this.findMongoose = this.findMongoose.find(queryObject);
    return this;
  }
  search() {
    if (this.queryString.keyword) {
      this.findMongoose = this.findMongoose.find({
        name: { $regex: this.queryString.keyword, $options: "i" },
      });
    }
    return this;
  }
  sort() {
    if (this.queryString.sort) {
      this.findMongoose.sort(this.queryString.sort);
    } else {
      this.findMongoose.sort("-createdAt");
    }
    return this;
  }
  pagination() {
    const page = this.queryString.page * 1 || 1;
    const limit = this.queryString.limit * 1 || 20;
    const skip = (page - 1) * limit;

    this.findMongoose = this.findMongoose.limit(limit).skip(skip);
    return this;
  }
}

module.exports = apiFeature;
