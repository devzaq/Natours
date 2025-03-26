class APIFeatures {
  constructor(query, queryObject) {
    this.query = query;
    this.queryObject = queryObject;
  }

  filter() {
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    let queryObj = { ...this.queryObject };
    excludedFields.forEach((e) => delete queryObj[e]);

    //2) Advanced Filtering
    const queryStr = JSON.stringify(queryObj);
    queryObj = JSON.parse(
      queryStr.replace(
        /\blt\b|\blte\b|\bgt\b|\bgte\b/g,
        (match) => `$${match}`,
      ),
    );

    this.query = this.query.find(queryObj);

    return this;
  }

  sorting() {
    if (this.queryObject?.sort) {
      const sortBy = this.queryObject.sort.split(',').join(' ');
      this.query = this.query.sort(sortBy);
    } else {
      this.query = this.query.sort('-createdAt');
    }

    return this;
  }

  limitFields() {
    if (this.queryObject?.fields) {
      const fields = this.queryObject.fields.split(',').join(' ');
      this.query = this.query.select(fields);
    } else {
      this.query.select('-__v');
    }

    return this;
  }

  pagination() {
    const page = +this.queryObject.page || 1;
    const limit = +this.queryObject.limit || 100;
    const skip = (page - 1) * limit;

    this.query = this.query.skip(skip).limit(limit);

    return this;
  }
}

module.exports = APIFeatures;
