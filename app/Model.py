from sqlalchemy import Column, Integer, String, Boolean, Float, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from flask_sqlalchemy import SQLAlchemy
from app import db

class Station(db.Model):
    __tablename__ = 'station'
    number = Column(Integer, primary_key=True)
    address = Column(String(255))
    banking = Column(Boolean)
    bonus = Column(Boolean)
    bike_stands = Column(Integer)
    name = Column(String(255))
    position_lat = Column(Float)
    position_lng = Column(Float)

    def to_dict(self):
        return {
            'number': self.number,
            'address': self.address,
            'banking': self.banking,
            'bonus': self.bonus,
            'bike_stands': self.bike_stands,
            'name': self.name,
            'position_lat': self.position_lat,
            'position_lng': self.position_lng
        }


class Availability(db.Model):
    __tablename__ = 'availability'
    id = Column(Integer, primary_key=True, autoincrement=True)
    number_id = Column(Integer, ForeignKey(Station.number, ondelete='CASCADE'))
    station = relationship('Station', backref='availability')
    last_update = Column(DateTime)
    available_bikes = Column(Integer)
    available_bike_stands = Column(Integer)
    status = Column(String(255))

    def to_dict(self):
        return {
            'id': self.id,
            'number_id': self.number_id,
            'last_update': self.last_update,
            'available_bikes': self.available_bikes,
            'available_bike_stands': self.available_bike_stands,
            'status': self.status
        }