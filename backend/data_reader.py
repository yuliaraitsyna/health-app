import xml.etree.ElementTree as ET

def parse_data(file_path):
    tree = ET.parse(file_path)
    root = tree.getroot()
    data = []

    for record in root.findall('Record'):
        record_type = record.get('type')
        start_date = record.get('startDate')
        end_date = record.get('endDate')
        value = record.get('value')

        if record_type == 'HKQuantityTypeIdentifierHeartRate':
            data.append({
                'type': record_type,
                'start_date': start_date,
                'end_date': end_date,
                'value': value
            })

    return data
